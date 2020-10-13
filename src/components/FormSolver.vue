<template>
  <v-container>
    <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    >
      <v-textarea
        v-model="equation"
        name="input-7-1"
        label="Equation"
        required
      />
      <v-row align-center>
        <v-btn
          :disabled="!valid"
          color="success"
          class="mx-auto"
          @click="validate"
        >
          Calulate
        </v-btn>
      </v-row>
    </v-form>
  </v-container>
</template>
<script>
export default {
  name: "FormSolver",
  data() {
    return {
      valid: '',
      equation: '',
      result: ''
    }
  },
  methods: {
    validate() {
      console.log('hello world')
      this.$calculate()
    }
  }
}
</script>