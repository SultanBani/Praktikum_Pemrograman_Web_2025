

Navigasi dan Struktur

Pertama, saya menggunakan git add . untuk menyeleksi semua file yang baru saya buat dan saya ubah termasuk style.css yang sudah di-update dan dua file HTML baru untuk Project dan Contact. Kemudian, saya menjalankan git commit -m "navigasi dan struktur baru". Ini penting. Dengan perintah ini, say menyimpan semua perubahan itu sebagai satu paket di riwayat lokal saya. Pesan commit-nya sudah jelas: 'navigasi dan struktur baru'. bisa dilihat di outputnya, ada 4 files changed dan dua file baru (contact.html dan project.html) sudah berhasil dibuat. Terakhir, saya menjalankan git push. Ini adalah langkah final untuk mengirim semua commit lokal yang saya buat tadi ke repositori saya di GitHub. Outputnya menunjukkan proses transfer datanya 100% selesai, dan perubahan dari commit terakhir saya (ID-nya 883eb05) sudah berhasil dikirim ke branch main.
![alt text](ImageFolder2/navStruk.jpeg)



Project

Log aktivitas ini menunjukkan bahwa saya telah menyelesaikan pekerjaan pada halaman proyek. Pertama, saya menggunakan git add . dan git commit -m "laman project" untuk menyimpan semua perubahan yang saya buat. Pesan commit ini jelas mendokumentasikan bahwa ini adalah commit untuk halaman proyek. Outputnya menunjukkan bahwa hanya 1 file changed, dengan 15 penambahan baris dan 4 penghapusan, yang mengonfirmasi bahwa saya fokus merapikan dan mengisi konten file project.html. Selanjutnya saya menjalankan git push. Proses dorongan ini berhasil 100%, dan commit terbaru saya (ID 9c2b868) kini sudah terunggah ke branch main di GitHub.
![alt text](ImageFolder2/projectImage.jpeg)



Contact

Sama seperti sebelumnya, saya menggunakan git add . untuk mengumpulkan semua perubahan yang telah saya buat di contact.html. Kemudian, saya menjalankan git commit -m "contact" untuk menyimpan perubahan ini secara lokal. Outputnya menunjukkan bahwa hanya 1 file changed dengan 6 penambahan baris dan 4 penghapusan, mengonfirmasi saya fokus mengisi dan merapikan konten contact.html. Terakhir, saya menggunakan git push untuk mengirim commit terbaru saya (ID 7ca082e) ke repositori GitHub. Proses push berhasil 100%, dan branch main sudah terbarui sepenuhnya dengan konten halaman kontak.
![alt text](ImageFolder2/contactImage.jpeg)



Header

Saya menggunakan git add . untuk menyiapkan file yang diubah, dan kemudian git commit -m "header" untuk menyimpan perubahan tersebut secara lokal. Output 1 file changed dengan 2 baris ditambahkan dan 1 baris dihapus. Selanjutnya, saya menjalankan git push untuk mengirim perbaikan header ini ke branch main di GitHub. Setelah pengiriman berhasil, sebagai langkah pencegahan, saya menjalankan git pull dan mendapatkan respons Already up to date.. Ini memastikan bahwa tidak perubahan di GitHub saat saya bekerja, sehingga repositori lokal dan remote saya benar-benar sinkron.
![alt text](ImageFolder2/header.jpeg)



Branch Experimen

Pertama, saya menggunakan perintah git branch eksperimen untuk membuat branch baru dengan nama yang spesifik. Kemudian, saya menjalankan git checkout eksperimen untuk berpindah ke branch, bisa dilihat konfirmasinya, Switched to branch 'eksperimen'. Setelah saya melakukan perubahan kecil di salah satu file, saya menyiapkan perubahan itu dengan git add . dan langsung menyimpannya dengan git commit -m "eksperimen". Komit ini menunjukkan 1 file changed, 1 insertion(+), 1 deletion(-), yang berarti ini adalah perubahan kecil. Sekarang, semua pekerjaan eksperimen ini tersimpan dengan aman di branch eksperimen dan tidak akan memengaruhi branch main.
![alt text](ImageFolder2/branchExperimen.jpeg)



Push Experimen

Setelah saya membuat commit eksperimen kecil di branch baru saya, langkah selanjutnya adalah mengirimkannya ke GitHub. Saya menggunakan perintah git push -u origin eksperimen karena ini adalah kali pertama saya mengirim branch ini. Perintah ini tidak hanya mengirim commit saya, tetapi juga membuat branch baru bernama eksperimen di repositori GitHub saya. Outputnya menunjukkan proses pengiriman berhasil 100% dan mengonfirmasi bahwa branch 'eksperimen' set up to track 'origin/eksperimen', yang berarti koneksi permanen sudah terbentuk. Setelah itu, saya menjalankan git push lagi, dan pesan Everything up-to-date mengonfirmasi bahwa tidak ada lagi commit yang perlu dikirim.
![alt text](ImageFolder2/pushEx.jpeg)



Move & Merge

Setelah saya selesai mencoba styling baru di branch eksperimen, saya untuk menerapkannya ke branch utama. Prosesnya dimulai dengan git checkout main untuk memastikan saya kembali ke branch utama yang. Git mengonfirmasi Switched to branch 'main' dan bahwa branch saya sudah up to date with 'origin/main'. Saya menjalankan git pull origin main sebagai tindakan pencegahan, yang dikonfirmasi Already up to date., memastikan tidak ada perubahan dari rekan lain yang bertabrakan.

Kemudian, saya menjalankan git merge eksperimen. Git melakukan Fast-forward karena branch main belum dimodifikasi sejak saya membuat branch eksperimen, dan penggabungan berhasil! bisa dilihat 1 file changed, 1 insertion(+), 1 deletion(-) di contact.html, yang berarti styling eksperimen kecil saya kini sudah ada di branch main. Terakhir, saya menjalankan git push untuk mengirim branch main yang sudah diperbarui ke GitHub.
![alt text](ImageFolder2/merge.jpeg)



Delete Branch

Setelah saya berhasil menggabungkan (merge) semua perubahan styling dari branch eksperimen ke branch utama (main), untuk menjaga repositori tetap rapi, saya menghapusnya. Pertama, saya menggunakan perintah git branch -d eksperimen untuk menghapus branch secara lokal dari laptop saya, yang dikonfirmasi oleh pesan Deleted branch eksperimen. Kemudian, saya menjalankan git push origin --delete eksperimen untuk menghapus branch tersebut dari GitHub (repositori remote). Setelah penghapusan berhasil, saya menjalankan git pull terakhir untuk memastikan repositori lokal saya benar-benar up to date dan mendapatkan konfirmasi Already up to date.. Ini artinya siklus kerja fitur saya: fitur dibuat, digabungkan, dan branch eksperimennya dibersihkan."
![alt text](ImageFolder2/deleteBranch.jpeg)
