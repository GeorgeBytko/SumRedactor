import { mount } from '@vue/test-utils'
import sumRedactor from "@/components/sum-redactor"

describe('sum-redactor.vue', () => {
  let minSum
  let title
  let initSum
  beforeEach(() => {
    minSum = 300
    title = 'default title'
    initSum = 1000
  })
  describe('Минимальная сумма', () => {
    minSum = 200
    title = 'test'
    test('Отображается, если входное значение меньше или равно', () => {
      initSum = 100
      const wrapper = mount(sumRedactor, {
        propsData: { minSum, title, initSum }
      })
      expect(wrapper.find('[data-qa="error"]')).toBeTruthy()
    })
    test('Не отображается, если входное значение больше', () => {
      initSum = 350
      const wrapper = mount(sumRedactor, {
        propsData: { minSum, title, initSum }
      })
      expect(wrapper.find('[data-qa="error"]').exists()).toBe(false)
    })
  })
  describe('Заголовок и входное значение', () => {
    test('Заголовок отображается', () => {
      const wrapper = mount(sumRedactor, {
        propsData: { minSum, title, initSum }
      })
      expect(wrapper.find('[data-qa="info-title"]').text()).toBe(title)
    })
    test('Входное значение отображается', () => {
      const wrapper = mount(sumRedactor, {
        propsData: { minSum, title, initSum }
      })
      expect(wrapper.find('[data-qa="field"]').text()).toBe(initSum.toString())
    })
  })
  describe('Кнопка ОК', () => {

    test('Событие submit всплывает', () => {
      const wrapper = mount(sumRedactor, {
        propsData: { minSum, title, initSum }
      })
      wrapper.find('[data-qa="btn-ok"]').trigger('click')
      expect(wrapper.emitted().submit).toBeTruthy()
    })
    test('Событие возрващает корректное значение числовое значение', () => {
      const wrapper = mount(sumRedactor, {
        propsData: { minSum, title, initSum }
      })
      wrapper.find('[data-qa="btn-ok"]').trigger('click')
      expect(wrapper.emitted().submit[0]).toEqual([initSum])
    })
  })
  describe('Кнопки с цифрами', () => {

    test('Добавляют цифру в конец коррентно', () => {
      const wrapper = mount(sumRedactor, {
        propsData: { minSum, title, initSum }
      })
      const btn = wrapper.find('[data-qa="btn-7"]')
      btn.trigger('click')
      expect(wrapper.vm.currentSum).toBe(initSum + btn.text())
    })
  })
  describe('Кнопка удаления последнего символа', () => {
    test('Удаляет последний символ корректно', () => {
      initSum = 100
      const initSumStr = initSum.toString()
      const wrapper = mount(sumRedactor, {
        propsData: { minSum, title, initSum }
      })
      wrapper.find('[data-qa="btn-delete"]').trigger('click')
      const reducedStr = initSumStr.slice(0, initSumStr.length - 1)
      expect(wrapper.vm.currentSum).toBe(reducedStr)
    })
    test('Заменяет единственный оставшийся символ на 0', () => {
      initSum = 1
      const wrapper = mount(sumRedactor, {
        propsData: { minSum, title, initSum }
      })
      wrapper.find('[data-qa="btn-delete"]').trigger('click')
      expect(wrapper.vm.currentSum).toBe('0')
    })
  })
  describe('Слот', () => {
    const someHtml = '<div class="random-class">Hello world</div>'
    const wrapper = mount(sumRedactor, {
      propsData: { minSum, title, initSum },
      slots: {
        default: someHtml
      }
    })
    test('Вставляется корректно', () => {
      expect(wrapper.find('.random-class').exists()).toBe(true)
    })
    test('Заменяет возможность удалить запись', () => {
      expect(wrapper.find('[data-qa="info-delete"]').exists()).toBe(false)
    })
  })
  describe('Удалить запись', () => {
    const wrapper = mount(sumRedactor, {
      propsData: { minSum, title, initSum }
    })
    wrapper.find('[data-qa="info-delete"]').trigger('click')
    test('Всплывает delete', () => {
      expect(wrapper.emitted().delete).toBeTruthy()
    })
  })
  describe('Кнопка закрыть', () => {
    const wrapper = mount(sumRedactor, {
      propsData: { minSum, title, initSum }
    })
    wrapper.find('[data-qa="close"]').trigger('click')
    test('Всплывает close', () => {
      expect(wrapper.emitted().close).toBeTruthy()
    })
  })
  describe('Максимальная длинна', () => {
    const maxSumLength = 3
    const wrapper = mount(sumRedactor, {
      propsData: { minSum, title, initSum, maxSumLength }
    })
    const btn = wrapper.find('[data-qa="btn-7"]')
    for (let i = 0; i < 10; i++) {
      btn.trigger('click')
    }
    test('Соблюдается после нескольких нажатий', () => {
      expect(wrapper.vm.currentSum.length).toBe(maxSumLength)
    })
  })
})