<template>
  <sum-redactor
      :min-sum="300"
      :init-sum="sum"
      title="Удаление миндалин лазером"
  >
  </sum-redactor>
</template>

<script>
import SumRedactor from "@/components/sum-redactor";
export default {
name: "Sums",
  components: {SumRedactor},
  data() {
    return {
      sum: 0
    }
  }
}
</script>