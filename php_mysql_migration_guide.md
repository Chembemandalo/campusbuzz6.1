# Migration Guide: From React SPA to a Dynamic PHP/MySQL Web App

This document provides a comprehensive guide for migrating the "Campus Buzz" application from a static React single-page application (SPA) using mock data to a fully dynamic web application with a PHP backend and a MySQL database running on a local XAMPP server.

## Architecture Overview: The Hybrid Model

We will not be rewriting the React application. Instead, we will adopt a modern, robust architecture that separates the frontend from the backend.

*   **Frontend (React):** This is our existing application. Its role is to handle the user interface (UI) and user experience (UX). It will be modified to **fetch data from our backend API** instead of using local mock files.
*   **Backend (PHP API):** This is a new layer we will build. It will **not generate any HTML**. Its sole purpose is to receive requests from the React app, interact with the database (create, read, update, delete data), and send data back in a universal format called **JSON**.
*   **Database (MySQL):** This will be our persistent data store, the single source of truth for all users, posts, comments, events, and other application data.

This separation allows for a fast, interactive frontend and a powerful, scalable backend.

---

## Step 1: Set Up Local Server Environment with XAMPP

First, we need a local server environment to run PHP and MySQL.

1.  **Install XAMPP**: Download and install XAMPP from the [official Apache Friends website](https://www.apachefriends.org). This package conveniently bundles:
    *   **Apache**: Our web server that will run the PHP scripts.
    *   **MySQL**: Our database server.
    *   **PHP**: The backend programming language.
    *   **phpMyAdmin**: A web-based tool to manage our database.
2.  **Start Services**: Open the XAMPP Control Panel and start the **Apache** and **MySQL** modules.
3.  **Project Folder**: Navigate to your XAMPP installation directory and find the `htdocs` folder. This is the root directory for your local web server. Create a new folder inside it named `campus-buzz`. This is where our PHP backend API will live.

---

## Step 2: Design and Create the MySQL Database

Next, we design the database schema based on the data structures defined in `types.ts`.

1.  **Access phpMyAdmin**: Open your web browser and navigate to `http://localhost/phpmyadmin`.
2.  **Create Database**: On the left sidebar, click "New". Enter the database name `campus_buzz_db`, select `utf8mb4_unicode_ci` as the collation for best character support, and click "Create".
3.  **Create Tables (SQL Schema)**: Select the `campus_buzz_db` database, go to the "SQL" tab, and execute the following script. This will create all the necessary tables to support the app's functionality.

    ```sql
    -- Users Table: Stores all user information
    CREATE TABLE `users` (
      `id` VARCHAR(50) PRIMARY KEY,
      `name` VARCHAR(255) NOT NULL,
      `email` VARCHAR(255) NOT NULL UNIQUE,
      `password` VARCHAR(255) NOT NULL, -- Will store a hashed password
      `avatarUrl` VARCHAR(255),
      `coverPhotoUrl` VARCHAR(255),
      `bio` TEXT,
      `role` ENUM('Student', 'Staff', 'Admin') NOT NULL DEFAULT 'Student',
      `department` VARCHAR(255),
      `major` VARCHAR(255),
      `status` ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
      `settings` JSON,
      `isMentor` BOOLEAN DEFAULT FALSE,
      `joinedDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Posts Table: Stores all user posts
    CREATE TABLE `posts` (
      `id` VARCHAR(50) PRIMARY KEY,
      `author_id` VARCHAR(50) NOT NULL,
      `content` TEXT NOT NULL,
      `imageUrl` VARCHAR(255),
      `creationDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    );

    -- Comments Table: Stores comments for posts and articles
    CREATE TABLE `comments` (
      `id` VARCHAR(50) PRIMARY KEY,
      `post_id` VARCHAR(50), -- Can be NULL if it's for an article
      `article_id` VARCHAR(50), -- Can be NULL if it's for a post
      `author_id` VARCHAR(50) NOT NULL,
      `text` TEXT NOT NULL,
      `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    );
    
    -- Friendships Table: Manages friend connections and requests
    CREATE TABLE `friendships` (
      `user_one_id` VARCHAR(50) NOT NULL,
      `user_two_id` VARCHAR(50) NOT NULL,
      `status` ENUM('pending', 'accepted', 'rejected') NOT NULL,
      `action_user_id` VARCHAR(50) NOT NULL, -- The user who performed the last action (sent request, accepted)
      PRIMARY KEY (`user_one_id`, `user_two_id`),
      FOREIGN KEY (`user_one_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
      FOREIGN KEY (`user_two_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    );
    
    -- Events Table
    CREATE TABLE `events` (
        `id` VARCHAR(50) PRIMARY KEY,
        `title` VARCHAR(255) NOT NULL,
        `description` TEXT,
        `imageUrl` VARCHAR(255),
        `startTime` DATETIME NOT NULL,
        `endTime` DATETIME NOT NULL,
        `organizer_id` VARCHAR(50) NOT NULL,
        FOREIGN KEY (`organizer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    );
    
    -- Event Attendees (Many-to-Many relationship)
    CREATE TABLE `event_attendees` (
        `event_id` VARCHAR(50) NOT NULL,
        `user_id` VARCHAR(50) NOT NULL,
        PRIMARY KEY (`event_id`, `user_id`),
        FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    );
    
    -- Articles Table
    CREATE TABLE `articles` (
        `id` VARCHAR(50) PRIMARY KEY,
        `author_id` VARCHAR(50) NOT NULL,
        `title` VARCHAR(255) NOT NULL,
        `content` LONGTEXT NOT NULL,
        `category` VARCHAR(100),
        `status` ENUM('published', 'draft') NOT NULL DEFAULT 'draft',
        `imageUrl` VARCHAR(255),
        `creationDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `views` INT DEFAULT 0,
        FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    );
    
    -- Add more tables as needed for Marketplace, Groups, etc. following this pattern.
    ```

---

## Step 3: Build the PHP Backend API

This API will be the bridge between our React frontend and the MySQL database.

1.  **API Folder**: Inside your `htdocs/campus-buzz` project, create an `api` folder.
2.  **Database Connection (`api/db.php`)**: This reusable file will handle our database connection.
    ```php
    <?php
    // For local development, allow requests from any origin.
    // For production, this should be restricted to your app's domain.
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json; charset=UTF-8");

    // Handle pre-flight requests for CORS
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit(0);
    }

    $servername = "localhost";
    $username = "root";
    $password = ""; // Default XAMPP password is empty
    $dbname = "campus_buzz_db";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
      http_response_code(500);
      echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
      exit();
    }
    ?>
    ```
3.  **Create API Endpoints**: Create a PHP file for each specific action.

    **Example 1: Fetch Posts (`api/posts.php`)**
    ```php
    <?php
    require 'db.php';

    // Using a JOIN to get author information along with the post
    $sql = "SELECT p.*, u.name as authorName, u.avatarUrl as authorAvatarUrl 
            FROM posts p 
            JOIN users u ON p.author_id = u.id 
            ORDER BY p.creationDate DESC";
            
    $result = $conn->query($sql);

    $posts = [];
    if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
        // Here you would also fetch comments and reactions for each post
        // This is a simplified example for clarity
        $posts[] = $row;
      }
    }

    http_response_code(200);
    echo json_encode($posts);
    $conn->close();
    ?>
    ```

    **Example 2: Create a Post (`api/create_post.php`)**
    ```php
    <?php
    require 'db.php';

    // Get the posted data from the React app
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->content) || !isset($data->authorId)) {
        http_response_code(400);
        echo json_encode(["error" => "Incomplete data provided."]);
        exit();
    }

    $id = "p" . time(); // Simple unique ID generation
    $content = $data->content;
    $authorId = $data->authorId;
    $imageUrl = isset($data->imageUrl) ? $data->imageUrl : null;

    // Use prepared statements to prevent SQL injection
    $stmt = $conn->prepare("INSERT INTO posts (id, author_id, content, imageUrl) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $id, $authorId, $content, $imageUrl);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Post created successfully.", "postId" => $id]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error creating post: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
    ?>
    ```
    
    **Example 3: User Login (`api/login.php`)**
    ```php
    <?php
    require 'db.php';

    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->email) || !isset($data->password)) {
        http_response_code(400);
        echo json_encode(["error" => "Email and password are required."]);
        exit();
    }
    
    $email = $data->email;
    $password = $data->password;

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        // IMPORTANT: Verify the hashed password
        if (password_verify($password, $user['password'])) {
            // Password is correct. Don't send the password hash back to the client.
            unset($user['password']); 
            http_response_code(200);
            echo json_encode($user);
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Invalid email or password."]);
        }
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid email or password."]);
    }

    $stmt->close();
    $conn->close();
    ?>
    ```

---

## Step 4: Integrate React Frontend with the API

The final step is to modify the React code to communicate with our new PHP backend.

1.  **Create an API Service**: To keep our code clean, let's centralize API calls. Create a new file `src/services/api.ts`.

    ```typescript
    // src/services/api.ts
    const API_BASE_URL = 'http://localhost/campus-buzz/api';

    // Helper function for making requests
    async function request(endpoint: string, options: RequestInit = {}) {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Something went wrong');
        }
        return response.json();
    }

    export const getPosts = () => request('posts.php');

    export const createPost = (postData: { content: string; authorId: string; imageUrl?: string | null }) => {
        return request('create_post.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });
    };
    
    export const login = (credentials: {email: string, password: string}) => {
         return request('login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
    }

    // ...add functions for all other API endpoints (getUsers, createEvent, etc.)
    ```

2.  **Refactor `App.tsx`**: Update the main component to fetch data on load.

    ```typescript
    import React, { useState, useEffect, useCallback } from 'react';
    import { getPosts } from './services/api'; // Import the new service
    // ... other imports

    const App: React.FC = () => {
      // Replace mock data state with empty initial state
      const [posts, setPosts] = useState<Post[]>([]);
      const [isLoading, setIsLoading] = useState(true);

      // Fetch data when the app loads
      useEffect(() => {
        const loadInitialData = async () => {
          try {
            const fetchedPosts = await getPosts();
            // You may need to format the data from PHP to match the 'Post' type exactly
            setPosts(fetchedPosts);
          } catch (error) {
            console.error("Failed to load posts:", error);
          } finally {
            setIsLoading(false);
          }
        };
        loadInitialData();
      }, []);
      
      // Update handlers to use the API service
      const handleLogin = async (email: string, password: string) => {
        try {
            const user = await api.login({ email, password });
            setCurrentUser(user);
            setIsAuthenticated(true);
            return { success: true, message: "Login successful!" };
        } catch (error) {
            return { success: false, message: (error as Error).message };
        }
      };

      const handleCreatePost = useCallback(async (content: string, image: string | null) => {
        if (!currentUser) return;
        try {
            await api.createPost({
                content,
                imageUrl: image,
                authorId: currentUser.id
            });
            // Re-fetch posts to see the new one or optimistically update the state
            const updatedPosts = await api.getPosts();
            setPosts(updatedPosts);
        } catch (error) {
            console.error("Failed to create post:", error);
        }
      }, [currentUser]);

      // ...continue refactoring all other handlers (handleSendMessage, handleRsvp, etc.)
      
      if (isLoading) {
          return <LoadingSpinner />;
      }

      // ... rest of the component
    };
    ```

3.  **Systematic Replacement**: Go through every component and feature.
    *   Replace direct use of `mockData` with state that is populated via API calls.
    *   Update all action handlers (`onSendMessage`, `onRsvp`, `onAddComment`, etc.) to call their corresponding function in `apiService.ts`.
    *   Add loading states (`isSaving`, `isDeleting`) to provide feedback to the user during API requests.

This methodical approach ensures all functionality is preserved while migrating to a robust, database-driven backend.
```