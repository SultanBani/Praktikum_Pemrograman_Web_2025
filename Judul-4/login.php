<?php
session_start();
$error = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Ambil data input
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    // Hardcoded credentials
    // Gunakan 'user' dan '123'
    if ($username === 'Bani' && $password === '000001') {
        $_SESSION['loggedin'] = true;
        $_SESSION['username'] = $username;
        
        // Inisialisasi array kontak jika belum ada
        if (!isset($_SESSION['kontak'])) {
            $_SESSION['kontak'] = [];
        }
        
        header("Location: index.php");
        exit;
    } else {
        $error = 'Username atau password salah.';
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - CRUD Kontak</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    
    <style>
        html, body { height: 100%; background-color: #f0f2f5; } 
        body { display: flex; align-items: center; justify-content: center; }
        .form-signin { 
            max-width: 380px; 
            padding: 30px; 
            background: white; 
            border-radius: 12px; 
            box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
        }
        .form-floating:focus-within { z-index: 2; }
        .btn-custom {
            background-color: #4a54e1;
            border-color: #4a54e1;
            transition: background-color 0.2s;
        }
        .btn-custom:hover {
            background-color: #3b45c9;
            border-color: #3b45c9;
        }
    </style>
</head>
<body>
    <div class="container">
       
        <main class="form-signin w-100 m-auto text-center">
            <form method="POST" action="login.php">
              <i class="bi bi-person-circle fs-1 text-primary mb-3"></i>
              <h1 class="h3 mb-4 fw-bold">Login Form</h1>
              
              <?php if ($error): ?>
                <div class="alert alert-danger" role="alert">
                    <?= htmlspecialchars($error) ?>
                </div>
              <?php endif; ?>

              <div class="form-floating mb-3">
                <input type="text" class="form-control" id="floatingInput" name="username" placeholder="Username" required>
                <label for="floatingInput"><i class="bi bi-person me-2"></i>Username</label>
              </div>
              
              <div class="form-floating mb-3">
                <input type="password" class="form-control" id="floatingPassword" name="password" placeholder="Password" required>
                <label for="floatingPassword"><i class="bi bi-lock me-2"></i>Password</label>
              </div>
          
              <button class="w-100 btn btn-lg btn-custom" type="submit">Masuk</button>
          </main>
                
    </div>
    </body>
</html>