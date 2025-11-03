

# Thư mục lưu backup
mkdir -p ./backups
BACKUP_FILE="./backups/railway_backup_$(date +%Y-%m-%d_%H-%M-%S).sql.gz"

# Sử dụng biến môi trường thay vì viết cứng
mysqldump -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD $DB_NAME --single-transaction --routines --triggers | gzip > $BACKUP_FILE

echo "Backup thành công: $BACKUP_FILE"
