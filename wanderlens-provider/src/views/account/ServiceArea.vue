<template>
  <el-card>
    <template #header>
      <div class="flex items-center justify-between">
        <span class="font-semibold">{{ t('serviceAreaPage.title') }}</span>
        <el-button type="primary" @click="save">{{ t('serviceAreaPage.save') }}</el-button>
      </div>
    </template>

    <el-tree
      ref="treeRef"
      :data="areaTree"
      show-checkbox
      node-key="id"
      :default-checked-keys="selectedKeys"
      :props="{ label: 'treeName', children: 'children' }"
    >
      <template #default="{ data }">
        <span>{{ data.name }}</span>
        <span v-if="data.minHours" class="ml-2 text-xs text-gray-400">
          （{{ t('serviceAreaPage.minHours', { hours: data.minHours }) }}）
        </span>
      </template>
    </el-tree>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const authStore = useAuthStore()
const treeRef = ref()
const areaTree = ref<any[]>([])
const selectedKeys = ref<number[]>([])

const save = async () => {
  const providerId = authStore.resolvedProviderId
  if (!providerId) return
  const checked = treeRef.value?.getCheckedKeys() || []
  try {
    await api.setServiceArea(providerId, {
      rootNodes: areaTree.value.map((n: { id: number }) => n.id),
      selectedNodes: checked,
    })
    ElMessage.success(t('serviceAreaPage.saveSuccess'))
  } catch {
    ElMessage.error(t('serviceAreaPage.saveFailed'))
  }
}

onMounted(async () => {
  const providerId = authStore.resolvedProviderId
  if (!providerId) return
  try {
    const res: any = await api.getServiceArea(providerId)
    const raw = res.data?.rootNodes || []
    const buildTreeName = (nodes: any[]) => {
      nodes.forEach((n) => {
        n.treeName = n.minHours
          ? `${n.name}（${t('serviceAreaPage.minHours', { hours: n.minHours })}）`
          : n.name
        if (n.children) buildTreeName(n.children)
      })
    }
    buildTreeName(raw)
    areaTree.value = raw
    selectedKeys.value = res.data?.selectedNodes || []
  } catch {
    // silent
  }
})
</script>
