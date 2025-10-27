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
3.  **Create Tables (SQL Schema)**: Select the `campus_buzz_db` database, go to the "SQL" tab, and execute the following script. This will create all the necessary tables, relationships, and constraints to support the app's functionality.

    ```sql
    -- Users Table: Stores all user information and mentor-specific details.
    CREATE TABLE `users` (
      `id` VARCHAR(50) PRIMARY KEY,
      `name` VARCHAR(255) NOT NULL,
      `email` VARCHAR(255) NOT NULL UNIQUE,
      `password` VARCHAR(255) NOT NULL, -- Will store a hashed password
      `avatarUrl` VARCHAR(255) DEFAULT 'https://picsum.photos/seed/newuser/200/200',
      `coverPhotoUrl` VARCHAR(255) DEFAULT 'https://picsum.photos/id/1040/1000/300',
      `bio` TEXT,
      `role` ENUM('Student', 'Staff', 'Admin') NOT NULL DEFAULT 'Student',
      `department` VARCHAR(255),
      `major` VARCHAR(255),
      `status` ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
      `onlineStatus` ENUM('online', 'offline') NOT NULL DEFAULT 'offline',
      `settings` JSON,
      `isMentor` BOOLEAN DEFAULT FALSE,
      `mentorshipCommunityId` VARCHAR(50),
      `acceptingNewMentees` BOOLEAN DEFAULT FALSE,
      `rating` JSON, -- e.g., {"score": 4.9, "reviews": 137}
      `institute` VARCHAR(255),
      `joiningYear` INT,
      `passingYear` INT,
      `sessionFee` DECIMAL(10, 2),
      `joinedDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Friendships Table: Manages friend connections and requests using a composite key.
    CREATE TABLE `friendships` (
      `user_one_id` VARCHAR(50) NOT NULL,
      `user_two_id` VARCHAR(50) NOT NULL,
      `status` ENUM('pending', 'accepted', 'rejected') NOT NULL,
      `action_user_id` VARCHAR(50) NOT NULL, -- The user who performed the last action
      PRIMARY KEY (`user_one_id`, `user_two_id`),
      FOREIGN KEY (`user_one_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
      FOREIGN KEY (`user_two_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    );

    -- Posts Table: Stores user-generated posts. Reactions are stored as JSON.
    CREATE TABLE `posts` (
      `id` VARCHAR(50) PRIMARY KEY,
      `author_id` VARCHAR(50) NOT NULL,
      `content` TEXT NOT NULL,
      `imageUrl` VARCHAR(255),
      `eventId` VARCHAR(50),
      `reactions` JSON, -- e.g., {"like": 75, "love": 40, ...}
      `shares` INT DEFAULT 0,
      `creationDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    );

    -- Articles Table: For news, blogs, and other long-form content.
    CREATE TABLE `articles` (
        `id` VARCHAR(50) PRIMARY KEY,
        `author_id` VARCHAR(50) NOT NULL,
        `title` VARCHAR(255) NOT NULL,
        `content` LONGTEXT NOT NULL,
        `category` VARCHAR(100),
        `status` ENUM('published', 'draft') NOT NULL DEFAULT 'draft',
        `imageUrl` VARCHAR(255),
        `views` INT DEFAULT 0,
        `reactions` JSON,
        `creationDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    );

    -- Comments Table: A polymorphic table for comments on both posts and articles.
    CREATE TABLE `comments` (
      `id` VARCHAR(50) PRIMARY KEY,
      `parent_id` VARCHAR(50) NOT NULL, -- This will be a post_id or article_id
      `parent_type` ENUM('post', 'article') NOT NULL,
      `author_id` VARCHAR(50) NOT NULL,
      `text` TEXT NOT NULL,
      `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    );

    -- Events Table
    CREATE TABLE `events` (
        `id` VARCHAR(50) PRIMARY KEY,
        `title` VARCHAR(255) NOT NULL,
        `description` TEXT,
        `imageUrl` VARCHAR(255),
        `startTime` DATETIME NOT NULL,
        `endTime` DATETIME NOT NULL,
        `location` VARCHAR(255),
        `organizer_id` VARCHAR(50) NOT NULL,
        FOREIGN KEY (`organizer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    );

    -- Event Attendees Table: Junction table for the many-to-many relationship between users and events.
    CREATE TABLE `event_attendees` (
        `event_id` VARCHAR(50) NOT NULL,
        `user_id` VARCHAR(50) NOT NULL,
        PRIMARY KEY (`event_id`, `user_id`),
        FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    );

    -- Marketplace Items Table
    CREATE TABLE `marketplace_items` (
      `id` VARCHAR(50) PRIMARY KEY,
      `name` VARCHAR(255) NOT NULL,
      `description` TEXT,
      `price` DECIMAL(10, 2) NOT NULL,
      `category` ENUM('Textbooks', 'Electronics', 'Furniture', 'Clothing', 'Other') NOT NULL,
      `seller_id` VARCHAR(50) NOT NULL,
      `status` ENUM('Available', 'Sold') NOT NULL DEFAULT 'Available',
      `creationDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    );

    -- Marketplace Item Images: One-to-many relationship with items.
    CREATE TABLE `marketplace_item_images` (
      `id` INT AUTO_INCREMENT PRIMARY KEY,
      `item_id` VARCHAR(50) NOT NULL,
      `imageUrl` VARCHAR(255) NOT NULL,
      FOREIGN KEY (`item_id`) REFERENCES `marketplace_items`(`id`) ON DELETE CASCADE
    );
    
    -- And so on... create tables for Groups, Jobs, Polls, Notifications, etc. following these patterns.
    -- For example, Polls would need a `polls` table, a `poll_options` table, and a `poll_votes` junction table.
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

    // Handle pre-flight requests from browsers for CORS
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

    **Example 1: User Registration (`api/register.php`)** - *Shows password hashing*
    ```php
    <?php
    require 'db.php';

    $data = json_decode(file_get_contents("php://input"));

    // Basic validation
    if (!isset($data->name) || !isset($data->email) || !isset($data->password)) {
        http_response_code(400);
        echo json_encode(["error" => "Incomplete data provided."]);
        exit();
    }

    $id = "u" . time() . rand(100, 999);
    $name = $data->name;
    $email = $data->email;
    // IMPORTANT: Hash the password before storing it using a strong algorithm.
    $password_hash = password_hash($data->password, PASSWORD_DEFAULT);

    // Check if email already exists
    $stmt_check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt_check->bind_param("s", $email);
    $stmt_check->execute();
    $stmt_check->store_result();
    if ($stmt_check->num_rows > 0) {
        http_response_code(409); // 409 Conflict
        echo json_encode(["error" => "An account with this email already exists."]);
        $stmt_check->close();
        $conn->close();
        exit();
    }
    $stmt_check->close();

    // Use prepared statements to prevent SQL injection
    $stmt = $conn->prepare("INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $id, $name, $email, $password_hash);

    if ($stmt->execute()) {
        http_response_code(201); // 201 Created
        echo json_encode(["message" => "User registered successfully.", "userId" => $id]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error registering user: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
    ?>
    ```
    
    **Example 2: User Login (`api/login.php`)** - *Shows password verification*
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
        // IMPORTANT: Verify the submitted password against the stored hash.
        if (password_verify($password, $user['password'])) {
            // Password is correct.
            // Do NOT send the password hash back to the client for security.
            unset($user['password']); 
            http_response_code(200);
            echo json_encode($user);
        } else {
            // Incorrect password
            http_response_code(401);
            echo json_encode(["error" => "Invalid email or password."]);
        }
    } else {
        // User not found
        http_response_code(401);
        echo json_encode(["error" => "Invalid email or password."]);
    }

    $stmt->close();
    $conn->close();
    ?>
    ```

    **Example 3: Fetch Posts (`api/posts.php`)** - *Shows a GET request*
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
    if ($result && $result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
        // Note: In a full app, you would run separate, efficient queries here
        // to fetch comments and reaction counts for each post to avoid performance issues.
        $posts[] = $row;
      }
    }

    http_response_code(200);
    echo json_encode($posts);
    $conn->close();
    ?>
    ```

---

## Step 4: Integrate React Frontend with the API

The final step is to modify the React code to communicate with our new PHP backend.

1.  **Create an API Service**: To keep our code clean, centralize all API calls. Create a new file, for example, `src/services/api.ts`.

    ```typescript
    // src/services/api.ts
    const API_BASE_URL = 'http://localhost/campus-buzz/api';

    // Helper function for making requests and handling errors
    async function request(endpoint: string, options: RequestInit = {}) {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'An unknown API error occurred');
        }
        return data;
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

    // ...add functions for all other API endpoints (getUsers, register, createEvent, etc.)
    ```

2.  **Refactor `App.tsx`**: Update the main component to fetch data on load instead of using mock data.

    ```typescript
    import React, { useState, useEffect, useCallback } from 'react';
    import * as api from './services/api'; // Import the new API service
    // ... other imports

    const App: React.FC = () => {
      // Replace mock data state with empty initial state
      const [posts, setPosts] = useState<Post[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      // ... other state initializations

      // Fetch data when the app loads
      useEffect(() => {
        const loadInitialData = async () => {
          setIsLoading(true);
          try {
            // Fetch multiple data points in parallel
            const [fetchedPosts, /* fetchedUsers, fetchedEvents */] = await Promise.all([
                api.getPosts(),
                // api.getUsers(),
                // api.getEvents(),
            ]);
            
            // NOTE: You may need to format the data from PHP (e.g., snake_case to camelCase, parsing JSON strings)
            // to match the TypeScript types exactly.
            setPosts(fetchedPosts);
          } catch (error) {
            console.error("Failed to load initial data:", error);
            // Here you could set an error state to show a message to the user
          } finally {
            setIsLoading(false);
          }
        };
        loadInitialData();
      }, []);
      
      // Update handlers to use the API service
      const handleLogin = async (email: string, password: string): Promise<{ success: boolean, message: string }> => {
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
            // Re-fetch posts to see the new one, or for a better UX, optimistically update the state.
            const updatedPosts = await api.getPosts();
            setPosts(updatedPosts);
        } catch (error) {
            console.error("Failed to create post:", error);
            // Show a toast notification to the user
        }
      }, [currentUser]);

      // ...continue refactoring all other handlers (handleSendMessage, handleRsvp, etc.) in the same way.
      
      if (isLoading) {
          return <LoadingSpinner fullScreen />;
      }

      // ... rest of the component
    };
    ```

3.  **Systematic Replacement**: Go through every component and feature.
    *   Replace direct use of `mockData` with state that is populated via API calls.
    *   Update all action handlers (`onSendMessage`, `onRsvp`, `onAddComment`, etc.) to call their corresponding function in the API service.
    *   Add loading states (`isSaving`, `isDeleting`) to provide instant feedback to the user during API requests.

This methodical approach ensures all functionality is preserved while migrating to a robust, database-driven backend.
