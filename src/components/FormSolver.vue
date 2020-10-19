<template>
  <v-container>
    <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    >
      <v-textarea
        v-model="equation"
        :error-messages="result.error"
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
    <!-- <v-row>
      {{result}}
    </v-row> -->
    <v-row v-if="Object.keys(result).includes('degree_number')">
      <v-col cols="4">
        <span class="font-weight-bold mr-5">Polynome de degré:</span>
      </v-col>
      <v-col>
        <span class="font-weight-light">{{result.degree_number}}</span>
      </v-col>
    </v-row>
    <v-row v-if="Object.keys(result).includes('reduced')">
      <v-col cols="4">
       <span class="font-weight-bold mr-5">Expression simplifié:</span>
      </v-col>
      <v-col>
       <span class="font-weight-light">{{result.reduced}} = 0</span>
      </v-col>      
    </v-row>
    <v-row>
      <v-row v-for="(reduced_solution, reduced_solution_key) in result.reduced_solutions" :key="reduced_solution_key">
        <v-col cols="6">
          <span class="font-weight-bold">{{reduced_solution_key}}:</span> 
        </v-col>
        <v-col cols="6">
          <span class="font-weight-light"> {{ reduced_solution }} </span>
        </v-col>
      </v-row>
    </v-row>
    <v-row>
      <v-row v-for="(solution, solution_key) in result.solutions" :key="solution_key">
        <v-col cols="6">
          <span class="font-weight-bold">{{solution_key}}:</span> 
        </v-col>
        <v-col cols="6">
          <span class="font-weight-light"> {{ solution }} </span>
        </v-col>
      </v-row>
    </v-row>
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
  watch: {
    equation() {
      this.result = Object.assign({}, {});
    }
  },  
  methods: {
    validate() {
      console.log('hello world')
      this.result = this.$calculate(this.equation)
      console.log(this.result);
    }
  }
}
</script>