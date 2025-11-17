<?php
session_start();

if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("Location: login.php");
    exit;
}

$kontak = &$_SESSION['kontak']; 
$error = [];
$message = '';
$input_data = [
    'id' => null,
    'nama' => '',
    'telepon' => '',
    'email' => ''
];

if (isset($_SESSION['msg'])) {
    $message = $_SESSION['msg'];
    unset($_SESSION['msg']);
}

function validate_input($data, $kontak, $current_id = null) {
    $errors = [];
    if (empty(trim($data['nama']))) { $errors['nama'] = 'Nama wajib diisi.'; }
    if (empty(trim($data['telepon']))) { 
        $errors['telepon'] = 'Telepon wajib diisi.';
    } elseif (!preg_match('/^[0-9]+$/', trim($data['telepon']))) {
        $errors['telepon'] = 'Telepon hanya boleh angka.';
    }
    if (empty(trim($data['email']))) {
        $errors['email'] = 'Email wajib diisi.';
    } elseif (!filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Format email tidak valid.';
    } else {
        foreach ($kontak as $k) {
            if ($k['email'] == trim($data['email']) && $k['id'] != $current_id) {
                $errors['email'] = 'Email ini sudah digunakan oleh kontak lain.';
                break;
            }
        }
    }
    return $errors;
}

if (isset($_GET['action']) && $_GET['action'] == 'delete' && isset($_GET['id'])) {
    $id_to_delete = $_GET['id'];
    foreach ($kontak as $key => $k) {
        if ($k['id'] == $id_to_delete) {
            unset($kontak[$key]);
            $kontak = array_values($kontak); 
            $_SESSION['msg'] = 'Kontak berhasil dihapus.';
            break;
        }
    }
    header("Location: index.php"); 
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'] ?? null;
    $data_to_process = [
        'id' => $id,
        'nama' => trim($_POST['nama'] ?? ''),
        'telepon' => trim($_POST['telepon'] ?? ''),
        'email' => trim($_POST['email'] ?? '')
    ];

    $error = validate_input($data_to_process, $kontak, $id);

    if (empty($error)) {
        $is_editing = !empty($id);
        
        if ($is_editing) {
            foreach ($kontak as $key => $k) {
                if ($k['id'] == $id) {
                    $kontak[$key] = $data_to_process;
                    $_SESSION['msg'] = 'Kontak **' . htmlspecialchars($data_to_process['nama']) . '** berhasil diupdate!';
                    break;
                }
            }
        } else {
            $new_id = time() . mt_rand(100, 999);
            $data_to_process['id'] = $new_id;
            $kontak[] = $data_to_process;
            $_SESSION['msg'] = 'Kontak **' . htmlspecialchars($data_to_process['nama']) . '** berhasil ditambahkan!';
        }
        header("Location: index.php");
        exit;
    } else {
        $input_data = $data_to_process;
    }
}


$is_editing_mode = false;
if (isset($_GET['action']) && $_GET['action'] == 'edit' && isset($_GET['id'])) {
    $id_to_edit = $_GET['id'];
    foreach ($kontak as $k) {
        if ($k['id'] == $id_to_edit) {
            $input_data = $k;
            $is_editing_mode = true;
            break;
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home - Sistem Kontak</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" xintegrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body>
    <div class="container">
        
        <!-- Header -->
        <div class="pt-5 d-flex justify-content-between align-items-center">
            <div class="col">
                <h1>Selamat Datang di Manajemen Kontak</h1>
                <p>Ini adalah halaman manajemen kontak.</p>
            </div>
            <div class="">
                <a href="logout.php" class="btn btn-danger"><i class="bi bi-box-arrow-right"></i> Logout</a>
            </div>
        </div>

        <!-- Pesan Status -->
        <?php if ($message): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <?= $message ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>

        <div class="row">
            <!-- Kolom Form  -->
            <div class="col-12 mb-5">
                <hr>
                <h2><?= $is_editing_mode ? 'Edit Data Kontak' : 'Tambah Data Kontak' ?></h2>
                <div class="col-12 col-md-5">
                    <form action="index.php" method="post">
                        <input type="hidden" name="id" value="<?= htmlspecialchars($input_data['id'] ?? '') ?>">

                        <!-- Input Nama -->
                        <div class="mb-3">
                            <label for="nama" class="form-label">Nama</label>
                            <input type="text" class="form-control <?= isset($error['nama']) ? 'is-invalid' : '' ?>" id="nama" name="nama" value="<?= htmlspecialchars($input_data['nama']) ?>">
                            <div class="invalid-feedback"><?= $error['nama'] ?? '' ?></div>
                        </div>
                        <!-- Input Telepon -->
                        <div class="mb-3">
                            <label for="telepon" class="form-label">Telepon</label>
                            <input type="text" class="form-control <?= isset($error['telepon']) ? 'is-invalid' : '' ?>" id="telepon" name="telepon" value="<?= htmlspecialchars($input_data['telepon']) ?>">
                            <div class="invalid-feedback"><?= $error['telepon'] ?? '' ?></div>
                        </div>
                        <!-- Input Email -->
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control <?= isset($error['email']) ? 'is-invalid' : '' ?>" id="email" name="email" value="<?= htmlspecialchars($input_data['email']) ?>">
                            <div class="invalid-feedback"><?= $error['email'] ?? '' ?></div>
                        </div>
                        
                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-<?= $is_editing_mode ? 'success' : 'primary' ?>">
                                <i class="bi bi-save"></i> <?= $is_editing_mode ? 'Simpan Perubahan' : 'Tambah' ?>
                            </button>
                            <?php if ($is_editing_mode): ?>
                                <a href="index.php" class="btn btn-outline-secondary">Batal Edit</a>
                            <?php endif; ?>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Daftar Kontak -->
            <div class="col-12">
                <h2>Daftar Kontak (<?= count($kontak) ?>)</h2>
            </div>
            
            <div class="col-12">
                <?php if (empty($kontak)): ?>
                    <div class="alert alert-info text-center" role="alert">
                        Tidak ada kontak yang terdaftar saat ini.
                    </div>
                <?php else: ?>
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nama</th>
                                    <th>Telepon</th>
                                    <th>Email</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php $no = 1; foreach ($kontak as $k): ?>
                                <tr>
                                    <td><?= $no++ ?></td>
                                    <td><?= htmlspecialchars($k['nama']) ?></td>
                                    <td><?= htmlspecialchars($k['telepon']) ?></td>
                                    <td><?= htmlspecialchars($k['email']) ?></td>
                                    <td class="text-nowrap">
                                        <a href="index.php?action=edit&id=<?= $k['id'] ?>" class="btn btn-sm btn-warning"><i class="bi bi-pencil-square"></i> Edit</a>
                                        <a href="index.php?action=delete&id=<?= $k['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Yakin hapus kontak <?= addslashes($k['nama']) ?>?');"><i class="bi bi-trash"></i> Hapus</a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</body>
</html>