#!/usr/bin/env bash
# Push to GitHub Helper Script
# Usage: ./scripts/push-to-github.sh <YOUR_GITHUB_REPO_URL>
# Example: ./scripts/push-to-github.sh https://github.com/myusername/fintech-expert.git

set -e

REPO_URL=$1

if [ -z "$REPO_URL" ]; then
  echo "خطا: لطفاً آدرس مخزن گیت‌هاب را مشخص کنید."
  echo "نحوه استفاده:"
  echo "  ./scripts/push-to-github.sh https://github.com/USERNAME/REPO.git"
  exit 1
fi

echo "=== بررسی و آماده‌سازی مخزن Git ==="
if [ ! -d ".git" ]; then
  git init -b main
else
  git branch -M main || true
fi

git config user.name "Fintech Researcher" || true
git config user.email "researcher@fintech-expert.local" || true

echo "=== افزودن فایل‌ها و ساخت کامیت ==="
git add .
git commit -m "feat: complete fintech expert elicitation system with DEMATEL, ANP and GitHub Pages support" || true

echo "=== اتصال به ریموت گیت‌هاب: $REPO_URL ==="
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

echo "=== پوش کردن به شاخه main گیت‌هاب ==="
git push -u origin main --force

echo ""
echo "✅ پروژه با موفقیت به گیت‌هاب ارسال شد!"
echo "گیت‌هاب اکشنز به صورت خودکار پروژه را بیلد و تا ۱ دقیقه دیگر در آدرس زیر منتشر می‌کند:"
echo "👉 https://<YOUR_USERNAME>.github.io/<YOUR_REPO>/"
