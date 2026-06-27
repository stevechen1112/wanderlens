# WanderLens 開發環境 Makefile
# 使用方式：make <target>

.PHONY: help up down restart status logs init db shell

# ──────────────────────────────────────────────
# 預設
# ──────────────────────────────────────────────
help: ## 顯示所有指令
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# ──────────────────────────────────────────────
# 基礎服務（MySQL + Redis + MinIO）
# ──────────────────────────────────────────────
up: ## 啟動基礎服務（MySQL + Redis + MinIO）
	docker compose up -d mysql redis minio
	@echo "✅ 基礎服務已啟動"
	@echo "   MySQL:  localhost:3306"
	@echo "   Redis:  localhost:6379"
	@echo "   MinIO:  localhost:9000 (API) / localhost:9001 (Console)"

up-full: ## 啟動所有服務（含應用）
	docker compose --profile full up -d
	@echo "✅ 所有服務已啟動"

down: ## 停止所有服務
	docker compose down
	@echo "✅ 所有服務已停止"

restart: ## 重啟所有服務
	docker compose restart
	@echo "✅ 所有服務已重啟"

status: ## 查看服務狀態
	docker compose ps

logs: ## 查看所有服務日誌
	docker compose logs -f --tail=100

logs-%: ## 查看指定服務日誌（make logs-mysql）
	docker compose logs -f --tail=100 $*

# ──────────────────────────────────────────────
# 初始化
# ──────────────────────────────────────────────
init: ## 初始化環境（複製 .env + 啟動基礎服務 + 初始化 MinIO）
	cp -n env/.env.dev.example .env.dev
	docker compose --env-file .env.dev up -d mysql redis minio
	@echo "等待服務就緒..."
	@sleep 10
	docker run --rm --network wanderlens-network \
		-e MINIO_ROOT_USER=wanderlens \
		-e MINIO_ROOT_PASSWORD=wanderlens123 \
		-v $(PWD)/docker/minio/init.sh:/init.sh:ro \
		--entrypoint /bin/sh \
		minio/mc:latest /init.sh
	@echo "✅ 環境初始化完成"

db: ## 初始化資料庫
	docker compose exec mysql mysql -u root -proot123 wanderlens_db < docker/mysql/init.sql
	@echo "✅ 資料庫已初始化"

# ──────────────────────────────────────────────
# 工具
# ──────────────────────────────────────────────
shell-mysql: ## 進入 MySQL Shell
	docker compose exec mysql mysql -u wanderlens -pwanderlens123 wanderlens_db

shell-redis: ## 進入 Redis CLI
	docker compose exec redis redis-cli

clean: ## 清除所有資料（⚠️ 會刪除所有資料）
	docker compose down -v
	@echo "⚠️ 所有資料已清除"