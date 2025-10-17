<template>
  <section>
    <h1>Entrenamientos</h1>
    <EntrenamientoCard
      titulo="Cardio Avanzado"
      descripcion="Ejercicios intensos de 30 minutos"
    />
    <EntrenamientoCard
      titulo="Yoga Básico"
      descripcion="Sesión relajante para principiantes"
    />
  </section>
</template>

<script setup lang="ts">
import EntrenamientoCard from '@/components/EntrenamientoCard.vue'
</script>


