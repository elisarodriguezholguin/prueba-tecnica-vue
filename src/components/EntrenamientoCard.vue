
<template>
  <div class="card">
    <p><strong>Fecha:</strong> {{ fecha }}</p>
    <p><strong>Duración:</strong> {{ duracion }} min</p>
    <p><strong>Distancia:</strong> {{ distancia }} km</p>
    <button @click="$emit('editar')">✏️Editar</button>
    <button @click="$emit('eliminar')">🗑️Eliminar</button>
  </div>
</template>

<script setup>
defineProps(["fecha", "duracion", "distancia", "index"]);
defineEmits(["editar","eliminar"]);
</script>



