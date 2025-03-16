import { createRouter, createWebHistory } from 'vue-router';
import ParentLessonPlanForm from '@/components/LessonPlan/ParentLessonPlanForm.vue';
import LessonPlanPreview from '@/components/LessonPlanPreview.vue';

const routes = [
  {
    path: '/',
    name: 'form',
    component: ParentLessonPlanForm,
  },
  {
    path: '/refresh',
    name: 'refresh',
    component: ParentLessonPlanForm
  },
  {
    path: '/preview',
    name: 'preview',
    component: LessonPlanPreview,
    props: true // Enable props passing from router
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: ParentLessonPlanForm
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
