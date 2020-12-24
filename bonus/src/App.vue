<template>
  <v-app>
    <v-main>
      <form-solver />
    </v-main>
  </v-app>
</template>

<script>
import FormSolver from './components/FormSolver';

export default {
  name: 'App',

  components: {
    FormSolver,
  },

  data: () => ({
    //
  }),
};
</script>
