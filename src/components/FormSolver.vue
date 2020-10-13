<template>
  <div>
    <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    >
      <v-text-field
        v-model="equation"
        required
      />
      <v-btn
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="validate"
      >
        Calulate
      </v-btn>
    </v-form>
  </div>
</template>
<script>
export default {
  name: "FormSolver",
  data() {
    return {
      valid: '',
      equation: ''
    }
  },
  methods: {
    validate() {
      console.log('hello world')
    }
  }
}
</script>