<template>
  <div class="sum-redact-container">
    <div class="sum-redact">
      <div class="sum-redact__header">
        <div class="sum-redact__info">
          <div class="sum-redact__info-title" data-qa="info-title">
            {{ title }}
          </div>
          <div class="sum-redact__info_slot-container">
            <slot>
              <div class="sum-redact__info-delete" data-qa="info-delete" @click="emitDeleteService">
                Удалить услугу
              </div>
            </slot>
          </div>
        </div>
        <div @click="$emit('close')" data-qa="close" class="sum-redact__close-btn">
        </div>
      </div>
      <div class="sum-redact__output">
        <div class="sum-redact__output-field" data-qa="field" :class="{'sum-redact__output-field_outlined': isSumLow && !isFirstError} ">
          {{ currentSum }}
        </div>
        <div class="sum-redact__output-info" data-qa="error" v-if="isSumLow && !isFirstError">
          Мин. сумма {{ minSum }} рублей
        </div>
      </div>
      <div class="sum-redact__buttons-container">
        <div class="sum-redact__buttons-row">
          <button
              v-for="n in [7,8,9]"
              class="sum-redact__buttons-btn"
              :key="n"
              @click="appendNumber(n)"
              :data-qa="'btn-'+n"
          >
            {{ n }}
          </button>
        </div>
        <div class="sum-redact__buttons-row">
          <button
              v-for="n in [4,5,6]"
              class="sum-redact__buttons-btn"
              :key="n"
              @click="appendNumber(n)"
          >
            {{ n }}
          </button>
        </div>
        <div class="sum-redact__buttons-row">
          <button
              v-for="n in [1,2,3]"
              class="sum-redact__buttons-btn"
              :key="n"
              @click="appendNumber(n)"
          >
            {{ n }}
          </button>
        </div>
        <div class="sum-redact__buttons-row">
          <button class="sum-redact__buttons-btn" @click="appendNumber(0)">0</button>
          <button
              data-qa="btn-delete"
              class="sum-redact__buttons-btn sum-redact__buttons-btn_delete"
              @click="deleteLastNumber"
          >
          </button>
          <button
              data-qa="btn-ok"
              class="sum-redact__buttons-btn sum-redact__buttons-btn_ok"
              @click="emitChangeSum"
              :disabled="isSumLow"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "sum-redactor",
  props: {
    minSum: {
      type: Number,
      required: true
    },
    initSum: {
      type: Number,
      default: 0
    },
    maxSumLength: {
      type: Number,
      default: 6
    },
    title: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      currentSum: this.initSum.toString() || '',
      isFirstError: true
    }
  },
  computed: {
    isSumLow() {
      return this.currentSum < this.minSum
    },
  },
  watch: {
    isSumLow(val, prev) {
      if (val && !prev) {
        this.isFirstError = false
      }

    }
  },
  methods: {
    emitChangeSum() {
      this.$emit('submit', +this.currentSum)
    },

    emitDeleteService() {
      this.$emit('delete')
    },

    appendNumber(num) {
      if (this.currentSum.length < this.maxSumLength) {
        this.currentSum = (+(this.currentSum + num)).toString()
      } else {
        this.currentSum = this.currentSum.slice(0, this.maxSumLength - 1) + num
      }
    },

    deleteLastNumber() {
      this.currentSum = this.currentSum.length === 1 ? '0' : this.currentSum.slice(0, this.currentSum.length - 1)
    }
  },
}
</script>

<style lang="scss">
.sum-redact {
  width: 370px;
  background-color: white;
  color: black;
  padding: 20px;

  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  &__close-btn {
    cursor: pointer;
    width: 15px;
    height: 15px;
    background: url("../assets/delete.svg") no-repeat;
    background-size: cover;
  }

  &__info {
    padding-top: 5px;
    text-align: start;
    width: 80%;

    &-delete {
      display: inline-block;
      color: #f13d3d;
      cursor: pointer;
      font-size: 0.9rem;

      &:hover {
        text-decoration: underline;
      }
    }

    &-title {
      margin-bottom: 7px;
      font-size: 1.5rem;
      font-weight: bold;
    }

    &_slot-container {
      color: rgba(117, 117, 117, 1);
    }
  }

  &-container {
    background-color: #d6d6d6;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sum-redact__output {
    margin-bottom: 15px;

    &-field {
      padding: 10px 30px 10px 10px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      background: #f1eded url("../assets/ruble.svg") no-repeat right;
      background-size: 25px 1em;
      border-radius: 5px;

      &_outlined {
        border: 2px solid #634ce9;
      }
    }

    &-info {
      color: #f13d3d;
      font-size: 0.9rem;
      padding-left: 10px;
      text-align: start;
    }
  }

  &__buttons-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  &__buttons-btn {
    border: 2px solid dodgerblue;
    color: dodgerblue;
    background-color: #ffffff;
    outline: none;
    font-size: 1.2rem;
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    border-radius: 5px;

    &:active {
      transform: scale(0.97);
    }

    &:hover {
      cursor: pointer;
    }

    &_ok {
      background-color: dodgerblue;
      color: #ffffff;

      &:disabled {
        background-color: lighten(dodgerblue, 20%);
        border-color: lighten(dodgerblue, 20%);
      }
    }

    &_delete {
      background: url("../assets/delete2.svg") no-repeat center;
      background-size: 25px 25px;
    }
  }
}
</style>