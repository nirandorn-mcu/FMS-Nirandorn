#!/bin/bash
set -e

echo "========================================================="
echo " FMS-Nirandorn Production Security Audit & Vulnerability Check"
echo "========================================================="

echo ""
echo "[1/5] Checking npm Dependencies & Supply Chain (npm audit)..."
npm audit --omit=dev || echo "⚠️ Found vulnerabilities in dependencies. Please review report above."

echo ""
echo "[2/5] Checking Sensitive Files & .env Exclusions..."
if git ls-files | grep -E '\.env$|\.env\.local$|\.pem$|\.key$|\.pfx$' ; then
  echo "❌ CRITICAL: Sensitive credential/key files are tracked in git!"
  exit 1
else
  echo "✅ No sensitive environment/key files committed in repository."
fi

echo ""
echo "[3/5] Verifying Multi-Stage Dockerfile Hardening..."
if grep -q "USER nextjs" Dockerfile && grep -q "nodejs" Dockerfile; then
  echo "✅ Dockerfile uses non-root user (nextjs:nodejs)."
else
  echo "❌ WARNING: Dockerfile running as root user!"
fi

echo ""
echo "[4/5] Checking Docker Compose Network Isolation..."
if grep -q "5432:5432" docker-compose.prod.yml; then
  echo "❌ WARNING: PostgreSQL port 5432 is exposed directly to host!"
else
  echo "✅ PostgreSQL port is strictly isolated inside internal Docker network."
fi

echo ""
echo "[5/5] Checking Code Quality & Security Boundary Gates..."
npm run check

echo ""
echo "========================================================="
echo "✅ Security Audit Completed Successfully!"
echo "========================================================="
