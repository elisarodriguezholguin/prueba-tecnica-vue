
<template>
  <div class="card">
    <p><strong>Fecha:</strong> {{ fecha }}</p>
    <p><strong>Duración:</strong> {{ duracion }} min</p>
    <p><strong>Distancia:</strong> {{ distancia }} km</p>
    <button @click="$emit('editar')">Editar</button>

  </div>
</template>

<script setup>
defineProps(["fecha", "duracion", "distancia", "index"]);
defineEmits(["editar"]);
</script>

<style scoped>
.card {
  background: #5ce2e2;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>

