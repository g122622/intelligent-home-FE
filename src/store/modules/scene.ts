import { defineStore } from "pinia"
import { getSceneList, createScene, updateScene, deleteScene } from "@/api/scene"

export const useSceneStore = defineStore("scene", {
  state: () => ({
    scenes: [] as Array<{
      id: number
      name: string
      description: string
      status: number
      startTime: string
      endTime: string
    }>,
    currentScene: null as any
  }),

  actions: {
    async fetchScenes(homeId: number) {
      const res = await getSceneList(homeId)
      this.scenes = res.scenes
    },

    async createScene(homeId: number, data: any) {
      await createScene(homeId, data)
      await this.fetchScenes(homeId)
    },

    async updateScene(homeId: number, sceneId: number, data: any) {
      await updateScene(homeId, sceneId, data)
      await this.fetchScenes(homeId)
    },

    async deleteScene(homeId: number, sceneId: number) {
      await deleteScene(homeId, sceneId)
      await this.fetchScenes(homeId)
    }
  }
})