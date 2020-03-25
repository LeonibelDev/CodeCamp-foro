const { $, Swal, SwalWithoutAnimation, triggerKeydownEvent, isVisible, isHidden, TIMEOUT } = require('./helpers')
const { toArray } = require('../../src/utils/utils')
const { measureScrollbar } = require('../../src/utils/dom/measureScrollbar')
const sinon = require('sinon/pkg/sinon')

QUnit.test('version is correct semver', (assert) => {
  assert.ok(Swal.version.match(/\d+\.\d+\.\d+/))
})

QUnit.test('modal shows up', (assert) => {
  Swal.fire('Hello world!')
  assert.ok(Swal.isVisible())
})

QUnit.test('the icon is shown', (assert) => {
  Swal.fire('', '', 'success')
  assert.ok(Swal.getIcon().classList.contains('swal2-success'))
})

QUnit.test('container scrolled to top and has scrollbar on open', (assert) => {
  const done = assert.async()
  SwalWithoutAnimation.fire({
    imageUrl: 'https://placeholder.pics/svg/300x1500',
    imageHeight: 1500,
    imageAlt: 'A tall image',
    onOpen: () => {
      assert.equal(Swal.getContainer().scrollTop, 0)
      assert.equal(Swal.getContainer().style.overflowY, 'auto')
      done()
    }
  })
})

QUnit.test('should throw console warning about invalid params', (assert) => {
  const _consoleWarn = console.warn
  const spy = sinon.spy(console, 'warn')
  Swal.fire({ invalidParam: 'oops' })
  console.warn = _consoleWarn
  assert.ok(spy.calledWith('SweetAlert2: Unknown parameter "invalidParam"'))
})

QUnit.test('should throw console error about unexpected params', (assert) => {
  const _consoleError = console.error
  const spy = sinon.spy(console, 'error')
  Swal.fire('Hello world!', { icon: 'success' })
  console.error = _consoleError
  assert.ok(spy.calledWith('SweetAlert2: Unexpected type of html! Expected "string" or "Element", got object'))
})

QUnit.test('should not throw console error about undefined params and treat them as empty strings', (assert) => {
  const _consoleError = console.error
  const spy = sinon.spy(console, 'error')
  Swal.fire(undefined, 'Hello world!', undefined)
  console.error = _consoleError
  assert.ok(spy.notCalled)
})

QUnit.test('should accept Elements as shorhand params', (assert) => {
  const title = document.createElement('strong')
  title.innerHTML = 'title'
  const content = document.createElement('a')
  content.innerHTML = 'content'
  Swal.fire(title, content, 'success')
  assert.equal(Swal.getTitle().innerHTML, '<strong>title</strong>')
  assert.equal(Swal.getHtmlContainer().innerHTML, '<a>content</a>')
})

QUnit.test('should not throw console error when <svg> tags are present (#1289)', (assert) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  document.body.appendChild(svg)
  const _consoleError = console.error
  const spy = sinon.spy(console, 'error')
  Swal.fire({})
  console.error = _consoleError
  assert.ok(spy.notCalled)
})

QUnit.test('should show the popup with OK button in case of empty object passed as an argument', (assert) => {
  Swal.fire({})
  assert.ok(isVisible(Swal.getConfirmButton()))
  assert.ok(isHidden(Swal.getCancelButton()))
  assert.equal(Swal.getTitle().textContent, '')
  assert.equal(Swal.getContent().textContent, '')
  assert.ok(isHidden(Swal.getFooter()))
})

QUnit.test('the vertical scrollbar should be hidden and the according padding-right should be set', (assert) => {
  const done = assert.async()
  const talltDiv = document.createElement('div')
  talltDiv.innerHTML = Array(100).join('<div>lorem ipsum</div>')
  document.body.appendChild(talltDiv)
  document.body.style.paddingRight = '30px'

  const scrollbarWidth = measureScrollbar()

  Swal.fire({
    title: 'The body has visible scrollbar, I will hide it and adjust padding-right on body',
    onAfterClose: () => {
      assert.equal(bodyStyles.paddingRight, '30px')
      document.body.removeChild(talltDiv)
      done()
    }
  })
  const bodyStyles = window.getComputedStyle(document.body)

  assert.equal(bodyStyles.paddingRight, `${scrollbarWidth + 30}px`)
  assert.equal(bodyStyles.overflow, 'hidden')
  Swal.clickConfirm()
})

QUnit.test('scrollbarPadding disabled', (assert) => {
  const talltDiv = document.createElement('div')
  talltDiv.innerHTML = Array(100).join('<div>lorem ipsum</div>')
  document.body.appendChild(talltDiv)
  document.body.style.paddingRight = '30px'

  Swal.fire({
    title: 'Padding right adjustment disabled',
    scrollbarPadding: false,
    onAfterClose: () => {
      document.body.removeChild(talltDiv)
    }
  })

  const bodyStyles = window.getComputedStyle(document.body)
  assert.equal(bodyStyles.paddingRight, '30px')
  Swal.clickConfirm()
})

QUnit.test('the vertical scrollbar should be restored before a toast is fired after a modal', (assert) => {
  const done = assert.async()
  const talltDiv = document.createElement('div')
  talltDiv.innerHTML = Array(100).join('<div>lorem ipsum</div>')
  document.body.appendChild(talltDiv)
  document.body.style.paddingRight = '30px'

  Swal.fire({
    title: 'The body has visible scrollbar, I will hide it and adjust padding-right on body'
  }).then(() => {
    Swal.fire({
      text: 'Body padding-right should be restored',
      toast: true,
      onOpen: () => {
        assert.equal(bodyStyles.paddingRight, '30px')
        document.body.removeChild(talltDiv)
        done()
      }
    })
  })

  const bodyStyles = window.getComputedStyle(document.body)
  Swal.clickConfirm()
})

QUnit.test('modal width', (assert) => {
  Swal.fire({ text: '300px', width: 300 })
  assert.equal(Swal.getPopup().style.width, '300px')

  Swal.fire({ text: '400px', width: '400px' })
  assert.equal(Swal.getPopup().style.width, '400px')

  Swal.fire({ text: '90%', width: '90%' })
  assert.equal(Swal.getPopup().style.width, '90%')
})

QUnit.test('heightAuto', (assert) => {
  Swal.fire('I should set .swal2-height-auto class to html and body')
  assert.ok(document.documentElement.classList.contains('swal2-height-auto'))

  Swal.fire({
    title: 'I am modeless and should not set .swal2-height-auto',
    backdrop: false
  })
  assert.ok(document.documentElement.classList.contains('swal2-height-auto'))

  Swal.fire({
    title: 'I am toast and should not set .swal2-height-auto',
    toast: true
  })
  assert.ok(document.documentElement.classList.contains('swal2-height-auto'))
})

QUnit.test('getters', (assert) => {
  Swal.fire('Title', 'Content')
  assert.equal(Swal.getTitle().innerText, 'Title')
  assert.equal(Swal.getContent().innerText.trim(), 'Content')

  Swal.fire({
    showCancelButton: true,
    imageUrl: '/assets/swal2-logo.png',
    confirmButtonText: 'Confirm button',
    confirmButtonAriaLabel: 'Confirm button aria-label',
    cancelButtonText: 'Cancel button',
    cancelButtonAriaLabel: 'Cancel button aria-label',
    footer: '<b>Footer</b>'
  })
  assert.ok(Swal.getImage().src.indexOf('/assets/swal2-logo.png'))
  assert.equal(Swal.getActions().textContent, 'Confirm buttonCancel button')
  assert.equal(Swal.getConfirmButton().innerText, 'Confirm button')
  assert.equal(Swal.getCancelButton().innerText, 'Cancel button')
  assert.equal(Swal.getConfirmButton().getAttribute('aria-label'), 'Confirm button aria-label')
  assert.equal(Swal.getCancelButton().getAttribute('aria-label'), 'Cancel button aria-label')
  assert.equal(Swal.getFooter().innerHTML, '<b>Footer</b>')

  Swal.fire({ input: 'text' })
  Swal.getInput().value = 'input text'
  assert.equal(Swal.getInput().value, 'input text')

  Swal.fire({
    input: 'radio',
    inputOptions: {
      one: 'one',
      two: 'two'
    }
  })
  $('.swal2-radio input[value="two"]').setAttribute('checked', true)
  assert.equal(Swal.getInput().value, 'two')
})

QUnit.test('content/title is set (html)', (assert) => {
  Swal.fire({
    title: '<strong>Strong</strong>, <em>Emphasis</em>',
    html: '<p>Paragraph</p><img /><button></button>'
  })

  assert.equal(Swal.getTitle().querySelectorAll('strong, em').length, 2)
  assert.equal(Swal.getContent().querySelectorAll('p, img, button').length, 3)
})

QUnit.test('content/title is set (text)', (assert) => {
  Swal.fire({
    titleText: '<strong>Strong</strong>, <em>Emphasis</em>',
    text: '<p>Paragraph</p><img /><button></button>'
  })

  assert.equal(Swal.getTitle().innerHTML, '&lt;strong&gt;Strong&lt;/strong&gt;, &lt;em&gt;Emphasis&lt;/em&gt;')
  assert.equal(Swal.getHtmlContainer().innerHTML, '&lt;p&gt;Paragraph&lt;/p&gt;&lt;img /&gt;&lt;button&gt;&lt;/button&gt;')
  assert.equal(Swal.getTitle().querySelectorAll('strong, em').length, 0)
  assert.equal(Swal.getContent().querySelectorAll('p, img, button').length, 0)
})

QUnit.test('JS element as html param', (assert) => {
  const p = document.createElement('p')
  p.textContent = 'js element'
  Swal.fire({
    html: p
  })
  assert.equal(Swal.getHtmlContainer().innerHTML, '<p>js element</p>')
})

QUnit.test('validation message', (assert) => {
  const done = assert.async()
  const inputValidator = (value) => Promise.resolve(!value && 'no falsy values')

  SwalWithoutAnimation.fire({ input: 'text', inputValidator })
  assert.ok(isHidden(Swal.getValidationMessage()))
  setTimeout(() => {
    const initialModalHeight = Swal.getPopup().offsetHeight

    Swal.clickConfirm()
    setTimeout(() => {
      assert.ok(isVisible(Swal.getValidationMessage()))
      assert.equal(Swal.getValidationMessage().textContent, 'no falsy values')
      assert.ok(Swal.getInput().getAttribute('aria-invalid'))
      assert.ok(Swal.getPopup().offsetHeight > initialModalHeight)

      Swal.getInput().value = 'blah-blah'

      // setting the value programmatically will not trigger the 'input' event,
      // doing that manually
      const event = document.createEvent('Event')
      event.initEvent('input', true, true)
      Swal.getInput().dispatchEvent(event)

      assert.ok(isHidden(Swal.getValidationMessage()))
      assert.notOk(Swal.getInput().getAttribute('aria-invalid'))
      assert.ok(Swal.getPopup().offsetHeight === initialModalHeight)
      done()
    }, TIMEOUT)
  }, TIMEOUT)
})

QUnit.test('should throw console error about unexpected type of InputOptions', (assert) => {
  const _consoleError = console.error
  const spy = sinon.spy(console, 'error')
  Swal.fire({ input: 'select', inputOptions: 'invalid-input-options' })
  console.error = _consoleError
  assert.ok(spy.calledWith('SweetAlert2: Unexpected type of inputOptions! Expected object, Map or Promise, got string'))
})

QUnit.test('showLoading and hideLoading', (assert) => {
  Swal.showLoading()
  assert.ok(Swal.getActions().classList.contains('swal2-loading'))

  Swal.hideLoading()
  assert.notOk(Swal.getActions().classList.contains('swal2-loading'))

  Swal.fire({
    title: 'test loading state',
    showConfirmButton: false
  })

  Swal.showLoading()
  assert.ok(isVisible(Swal.getActions()))
  assert.ok(Swal.getActions().classList.contains('swal2-loading'))

  Swal.hideLoading()
  assert.notOk(isVisible(Swal.getActions()))
  assert.notOk(Swal.getActions().classList.contains('swal2-loading'))
})

QUnit.test('disable/enable buttons', (assert) => {
  Swal.fire('test disable/enable buttons')

  Swal.disableButtons()
  assert.ok(Swal.getConfirmButton().disabled)
  assert.ok(Swal.getCancelButton().disabled)

  Swal.enableButtons()
  assert.notOk(Swal.getConfirmButton().disabled)
  assert.notOk(Swal.getCancelButton().disabled)
})

QUnit.test('disable/enable input', (assert) => {
  Swal.fire('(disable/enable)Input should not fail if there is no input')
  Swal.disableInput()
  Swal.enableInput()

  Swal.fire({
    input: 'text'
  })

  Swal.disableInput()
  assert.ok(Swal.getInput().disabled)
  Swal.enableInput()
  assert.notOk(Swal.getInput().disabled)

  Swal.fire({
    input: 'radio',
    inputOptions: {
      one: 'one',
      two: 'two'
    }
  })

  Swal.disableInput()
  toArray($('.swal2-radio').querySelectorAll('radio')).forEach((radio) => {
    assert.ok(radio.disabled)
  })
  Swal.enableInput()
  toArray($('.swal2-radio').querySelectorAll('radio')).forEach((radio) => {
    assert.notOk(radio.disabled)
  })
})

QUnit.test('reversed buttons', (assert) => {
  Swal.fire({
    text: 'Modal with reversed buttons',
    showCancelButton: true,
    reverseButtons: true
  })
  assert.equal(Swal.getConfirmButton().previousSibling, Swal.getCancelButton())

  Swal.fire('Modal with buttons')
  assert.equal(Swal.getCancelButton().previousSibling, Swal.getConfirmButton())
})

QUnit.test('modal vertical offset', (assert) => {
  const done = assert.async(1)
  // create a modal with dynamic-height content
  SwalWithoutAnimation.fire({
    imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNikAQAACIAHF/uBd8AAAAASUVORK5CYII=',
    title: 'Title',
    html: '<hr><div style="height: 50px"></div><p>Text content</p>',
    icon: 'warning',
    input: 'text'
  })

  // listen for image load
  Swal.getImage().addEventListener('load', () => {
    const box = Swal.getPopup().getBoundingClientRect()
    const delta = box.top - (box.bottom - box.height)
    // allow 1px difference, in case of uneven height
    assert.ok(Math.abs(delta) <= 1)
    done()
  })
})

QUnit.test('onOpen', (assert) => {
  const done = assert.async()

  // create a modal with an onOpen callback
  Swal.fire({
    title: 'onOpen test',
    onOpen: (modal) => {
      assert.equal(Swal.getPopup(), modal)
      done()
    }
  })
})

QUnit.test('onBeforeOpen', (assert) => {
  const done = assert.async()

  // create a modal with an onBeforeOpen callback
  Swal.fire({
    title: 'onBeforeOpen test',
    onBeforeOpen: (modal) => {
      assert.notOk(Swal.isVisible())
      assert.equal(Swal.getPopup(), modal)
    }
  })

  // check that onBeforeOpen calls properly
  const dynamicTitle = 'Set onBeforeOpen title'
  Swal.fire({
    title: 'onBeforeOpen test',
    onBeforeOpen: () => {
      Swal.getTitle().innerHTML = dynamicTitle
    },
    onOpen: () => {
      assert.equal(Swal.getTitle().innerHTML, dynamicTitle)
      done()
    }
  })
})

QUnit.test('onRender', (assert) => {
  const onRender = sinon.fake()

  // create a modal with an onRender callback
  // the onRender hook should be called once here
  Swal.fire({
    title: 'onRender test',
    onRender
  })

  assert.ok(onRender.calledOnce)

  // update the modal, causing a new render
  // the onRender hook should be called once again
  Swal.update({})

  assert.ok(onRender.calledTwice)

  // the modal element must always be passed to the onRender hook
  assert.ok(onRender.alwaysCalledWithExactly(Swal.getPopup()))
})

QUnit.test('onAfterClose', (assert) => {
  const done = assert.async()
  let onCloseFinished = false

  // create a modal with an onAfterClose callback
  Swal.fire({
    title: 'onAfterClose test',
    onClose: () => {
      onCloseFinished = true
    },
    onAfterClose: () => {
      assert.ok(onCloseFinished)
      assert.notOk(Swal.getContainer())
      done()
    }
  })

  Swal.getCloseButton().click()
})

QUnit.test('onClose', (assert) => {
  const done = assert.async()

  // create a modal with an onClose callback
  Swal.fire({
    title: 'onClose test',
    onClose: (_modal) => {
      assert.ok(modal, _modal)
      assert.ok(Swal.getContainer())
      done()
    }
  })

  const modal = Swal.getPopup()
  Swal.getCloseButton().click()
})

QUnit.test('onDestroy', (assert) => {
  const done = assert.async()
  let firstPopupDestroyed = false
  Swal.fire({
    title: '1',
    onDestroy: () => {
      firstPopupDestroyed = true
    }
  })
  Swal.fire({
    title: '2',
    onDestroy: () => {
      done()
    }
  })
  assert.ok(firstPopupDestroyed)
  Swal.getConfirmButton().click()
})

QUnit.test('Swal.fire() in onClose', (assert) => {
  const done = assert.async()

  Swal.fire({
    title: 'onClose test',
    onClose: () => {
      Swal.fire({
        text: 'OnClose',
        input: 'text',
        customClass: {
          input: 'on-close-swal'
        }
      })
    }
  }).then(() => {
    assert.ok(Swal.isVisible())
    assert.ok(Swal.getInput().classList.contains('on-close-swal'))
    done()
  })

  Swal.clickConfirm()
})

QUnit.test('esc key', (assert) => {
  const done = assert.async()

  document.body.addEventListener('keydown', () => {
    throw new Error('Should not propagate keydown event to body!')
  })

  SwalWithoutAnimation.fire({
    title: 'Esc me',
    onOpen: () => triggerKeydownEvent(Swal.getPopup(), 'Escape')
  }).then((result) => {
    assert.deepEqual(result, { dismiss: Swal.DismissReason.esc })
    done()
  })
})

QUnit.test('allowEscapeKey as a function', (assert) => {
  const done = assert.async()

  let functionWasCalled = false

  SwalWithoutAnimation.fire({
    title: 'allowEscapeKey as a function',
    allowEscapeKey: () => {
      functionWasCalled = true
      return false
    },
    onOpen: () => {
      assert.equal(functionWasCalled, false)

      triggerKeydownEvent(Swal.getPopup(), 'Escape')

      setTimeout(() => {
        assert.equal(functionWasCalled, true)
        assert.ok(Swal.isVisible())

        done()
      })
    }
  })
})

QUnit.test('close button', (assert) => {
  const done = assert.async()

  Swal.fire({
    title: 'Close button test',
    showCloseButton: true
  }).then((result) => {
    assert.deepEqual(result, { dismiss: Swal.DismissReason.close })
    done()
  })

  const closeButton = Swal.getCloseButton()
  assert.ok(isVisible(closeButton))
  assert.equal(closeButton.getAttribute('aria-label'), 'Close this dialog')
  closeButton.click()
})

QUnit.test('close button customization', (assert) => {
  Swal.fire({
    title: 'Customized Close button test',
    showCloseButton: true,
    closeButtonHtml: 'c'
  })

  const closeButton = Swal.getCloseButton()
  assert.equal(closeButton.innerHTML, 'c')
})

QUnit.test('cancel button', (assert) => {
  const done = assert.async()

  Swal.fire({
    title: 'Cancel me'
  }).then((result) => {
    assert.deepEqual(result, { dismiss: Swal.DismissReason.cancel })
    done()
  })

  Swal.clickCancel()
})

QUnit.test('timer', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire({
    title: 'Timer test',
    timer: 10
  }).then((result) => {
    assert.deepEqual(result, { dismiss: Swal.DismissReason.timer })
    done()
  })
})

QUnit.test('timerProgressBar', (assert) => {
  SwalWithoutAnimation.fire({
    title: 'Timer test',
    timer: 10,
    timerProgressBar: true
  })

  const progressBar = document.querySelector('.swal2-timer-progress-bar')
  assert.ok(isVisible(progressBar))
})

QUnit.test('params validation', (assert) => {
  assert.ok(Swal.isValidParameter('title'))
  assert.notOk(Swal.isValidParameter('foobar'))
})

QUnit.test('addition and removal of backdrop', (assert) => {
  Swal.fire({ backdrop: false })
  assert.ok(document.body.classList.contains('swal2-no-backdrop'))
  assert.ok(document.documentElement.classList.contains('swal2-no-backdrop'))
  Swal.fire({ title: 'test' })
  assert.notOk(document.body.classList.contains('swal2-no-backdrop'))
  assert.notOk(document.documentElement.classList.contains('swal2-no-backdrop'))
})

QUnit.test('footer', (assert) => {
  Swal.fire({ title: 'Modal with footer', footer: 'I am footer' })
  assert.ok(isVisible(Swal.getFooter()))

  Swal.fire('Modal w/o footer')
  assert.ok(isHidden(Swal.getFooter()))
})

QUnit.test('visual apperarance', (assert) => {
  Swal.fire({
    padding: '2em',
    background: 'red',
    confirmButtonColor: 'green',
    cancelButtonColor: 'blue'
  })

  assert.equal(Swal.getPopup().style.padding, '2em')
  assert.equal(window.getComputedStyle(Swal.getPopup()).backgroundColor, 'rgb(255, 0, 0)')
  assert.equal(Swal.getConfirmButton().style.backgroundColor, 'green')
  assert.equal(Swal.getCancelButton().style.backgroundColor, 'blue')
})

QUnit.test('null values', (assert) => {
  const defaultParams = require('../../src/utils/params').default
  const params = {}
  Object.keys(defaultParams).forEach(key => {
    params[key] = null
  })
  Swal.fire(params)
  assert.ok(Swal.isVisible())
})

QUnit.test('backdrop accepts css background param', (assert) => {
  Swal.fire({
    title: 'I have no backdrop',
    backdrop: false
  })
  assert.notOk(Swal.getContainer().style.background)

  const backdrop = 'rgb(123, 123, 123)'
  Swal.fire({
    title: 'I have a custom backdrop',
    backdrop
  })
  assert.ok(Swal.getContainer().style.background.includes(backdrop))
})

QUnit.test('preConfirm return false', (assert) => {
  SwalWithoutAnimation.fire({
    preConfirm: () => {
      return false
    }
  })

  Swal.clickConfirm()
  assert.ok(Swal.isVisible())
})

QUnit.test('Custom content', (assert) => {
  const done = assert.async()
  Swal.fire({
    showCancelButton: true,
    onOpen: () => {
      Swal.getContent().textContent = 'Custom content'
      Swal.clickConfirm()
    },
    preConfirm: () => {
      return 'Some data from custom control'
    }
  }).then(result => {
    assert.ok(result.value)
    done()
  })
})

QUnit.test('preConfirm returns 0', (assert) => {
  const done = assert.async()
  SwalWithoutAnimation.fire({
    onOpen: () => {
      Swal.clickConfirm()
    },
    preConfirm: () => {
      return 0
    }
  }).then(result => {
    assert.equal(result.value, 0)
    done()
  })
})

QUnit.test('Model shows with swal2 classes used in html', (assert) => {
  Swal.fire({
    html: '<span class="swal2-cancel"></span>'
  })
  assert.ok(Swal.getPopup().classList.contains('swal2-show'))
  Swal.close()
})
