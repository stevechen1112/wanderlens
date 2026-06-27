<template>
  <div class="space-y-4">
    <el-card>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold">修圖規範文件</h2>
        <el-tag type="info">v2.0</el-tag>
      </div>

      <el-tabs v-model="activeTab">
        <!-- 基本要求 -->
        <el-tab-pane label="基本要求" name="basic">
          <div class="prose prose-sm max-w-none">
            <h3 class="font-semibold mb-2">膚質修飾</h3>
            <ul class="list-disc pl-6 space-y-1">
              <li>保留自然紋理，不過度磨皮</li>
              <li>去除暫時性瑕疵（痘痘、疤痕、痣視情況保留）</li>
              <li>眼袋與黑眼圈適度淡化，不完全消除</li>
              <li>牙齒自然美白，不改變齒型</li>
            </ul>
            <h3 class="font-semibold mb-2 mt-4">色彩調整</h3>
            <ul class="list-disc pl-6 space-y-1">
              <li>飽和度適中，色溫自然</li>
              <li>保留現場光線氛圍</li>
              <li>不過度 HDR 或局部調整</li>
              <li>膚色一致，不偏紅或偏黃</li>
            </ul>
            <h3 class="font-semibold mb-2 mt-4">構圖裁切</h3>
            <ul class="list-disc pl-6 space-y-1">
              <li>不裁切主體，保留原始比例</li>
              <li>水平線修正（風景照）</li>
              <li>透視修正（建築照）</li>
            </ul>
          </div>
        </el-tab-pane>

        <!-- 輸出規格 -->
        <el-tab-pane label="輸出規格" name="output">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="格式">JPEG</el-descriptions-item>
            <el-descriptions-item label="品質">95 以上</el-descriptions-item>
            <el-descriptions-item label="色彩空間">sRGB</el-descriptions-item>
            <el-descriptions-item label="最大寬度">2048px</el-descriptions-item>
            <el-descriptions-item label="檔案命名">{orderId}_{序號}_retouched.jpg</el-descriptions-item>
            <el-descriptions-item label="EXIF">保留拍攝資訊，新增修圖軟體標記</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <!-- 交期與流程 -->
        <el-tab-pane label="交期與流程" name="deadline">
          <div class="prose prose-sm max-w-none">
            <h3 class="font-semibold mb-2">交期</h3>
            <ul class="list-disc pl-6 space-y-1">
              <li>自派工日起 <strong>48 小時</strong>內交付</li>
              <li>逾時 24 小時內：系統自動記錄，影響評分</li>
              <li>逾時超過 24 小時：平台有權退修並重新派工</li>
            </ul>
            <h3 class="font-semibold mb-2 mt-4">流程</h3>
            <ol class="list-decimal pl-6 space-y-1">
              <li>收到派工通知 → 確認接單</li>
              <li>下載 RAW 檔案（預簽 URL，2 小時有效）</li>
              <li>開始處理（系統記錄開始時間）</li>
              <li>修圖完成 → 上傳成品</li>
              <li>平台驗收 → 結算付款</li>
            </ol>
          </div>
        </el-tab-pane>

        <!-- 退修標準 -->
        <el-tab-pane label="退修標準" name="reject">
          <div class="prose prose-sm max-w-none">
            <h3 class="font-semibold mb-2">常見退修原因</h3>
            <el-table :data="rejectReasons" border size="small">
              <el-table-column prop="reason" label="原因" min-width="150" />
              <el-table-column prop="level" label="嚴重度" width="80">
                <template #default="{ row }">
                  <el-tag :type="row.level === '高' ? 'danger' : 'warning'" size="small">{{ row.level }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="desc" label="說明" min-width="200" />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const activeTab = ref('basic')

const rejectReasons = [
  { reason: '過度磨皮', level: '高', desc: '皮膚失去紋理，塑膠感' },
  { reason: '色彩偏差', level: '中', desc: '膚色不自然，色溫偏離現場' },
  { reason: '構圖錯誤', level: '高', desc: '裁切到主體或重要元素' },
  { reason: '解析度不足', level: '高', desc: '成品低於 2048px 寬度' },
  { reason: '品質過低', level: '中', desc: 'JPEG 品質低於 95' },
  { reason: '交期逾期', level: '高', desc: '超過 48 小時未交付' },
]
</script>