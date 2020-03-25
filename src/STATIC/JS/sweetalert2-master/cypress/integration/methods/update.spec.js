import { $, Swal, SwalWithoutAnimation, isVisible } from '../../utils'
import { defaultParams, updatableParams } from '../../../src/utils/params'

describe('update()', () => {
  it('all updatableParams are valid', () => {
    expect(updatableParams.length).not.to.equal(0)
    updatableParams.forEach((updatableParam) => {
      if (!(updatableParam in defaultParams)) {
        throw new Error(`Invalid updatable param: ${updatableParam}`)
      }
    })
  })

  it('update() method', () => {
    SwalWithoutAnimation.fire({
      icon: 'success',
      input: 'text',
      imageUrl: '/assets/swal2-logo.png',
    })

    Swal.update({
      title: 'New title',
      html: 'New content',
      icon: 'success',
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'New cancel button text',
      imageUrl: '/assets/swal2-logo.png'
    })

    expect(Swal.getTitle().textContent).to.equal('New title')
    expect(Swal.getContent().textContent).to.equal('New content')

    expect(isVisible(Swal.getIcon())).to.be.true
    expect(Swal.getIcon()).to.equal($('.swal2-success'))

    expect(isVisible(Swal.getImage())).to.be.true
    expect(Swal.getImage().src.indexOf('/assets/swal2-logo.png') > 0).to.be.true

    assert.notOk(isVisible(Swal.getConfirmButton()))
    expect(isVisible(Swal.getCancelButton())).to.be.true
    expect(Swal.getCancelButton().textContent).to.equal('New cancel button text')
  })

  it('update customClass', () => {
    SwalWithoutAnimation.fire({
      icon: 'success',
      imageUrl: '/assets/swal2-logo.png',
      input: 'text'
    })

    Swal.update({
      customClass: {
        container: 'container-class',
        popup: 'popup-class',
        header: 'header-class',
        title: 'title-class',
        closeButton: 'close-button-class',
        icon: 'icon-class',
        image: 'image-class',
        content: 'content-class',
        input: 'input-class',
        actions: 'actions-class',
        confirmButton: 'confirm-button-class',
        cancelButton: 'cancel-button-class',
        footer: 'footer-class'
      }
    })

    // new custom classnames should be added, and the previous custom classnames should be removed
    Swal.update({
      customClass: {
        container: 'container-class-NEW',
        popup: 'popup-class-NEW',
        header: 'header-class-NEW',
        title: 'title-class-NEW',
        closeButton: 'close-button-class-NEW',
        icon: 'icon-class-NEW',
        image: 'image-class-NEW',
        content: 'content-class-NEW',
        input: 'input-class-NEW',
        actions: 'actions-class-NEW',
        confirmButton: 'confirm-button-class-NEW',
        cancelButton: 'cancel-button-class-NEW',
        footer: 'footer-class-NEW'
      }
    })

    assert.notOk(Swal.getContainer().classList.contains('container-class'))
    assert.notOk(Swal.getPopup().classList.contains('popup-class'))
    assert.notOk(Swal.getHeader().classList.contains('header-class'))
    assert.notOk(Swal.getTitle().classList.contains('title-class'))
    assert.notOk(Swal.getCloseButton().classList.contains('close-button-class'))
    assert.notOk(Swal.getIcon().classList.contains('icon-class'))
    assert.notOk(Swal.getImage().classList.contains('image-class'))
    assert.notOk(Swal.getContent().classList.contains('content-class'))
    assert.notOk(Swal.getInput().classList.contains('input-class'))
    assert.notOk(Swal.getActions().classList.contains('actions-class'))
    assert.notOk(Swal.getConfirmButton().classList.contains('confirm-button-class'))
    assert.notOk(Swal.getCancelButton().classList.contains('cancel-button-class'))
    assert.notOk(Swal.getFooter().classList.contains('footer-class'))

    expect(Swal.getContainer().classList.contains('container-class-NEW')).to.be.true
    expect(Swal.getPopup().classList.contains('popup-class-NEW')).to.be.true
    expect(Swal.getHeader().classList.contains('header-class-NEW')).to.be.true
    expect(Swal.getTitle().classList.contains('title-class-NEW')).to.be.true
    expect(Swal.getCloseButton().classList.contains('close-button-class-NEW')).to.be.true
    expect(Swal.getIcon().classList.contains('icon-class-NEW')).to.be.true
    expect(Swal.getImage().classList.contains('image-class-NEW')).to.be.true
    expect(Swal.getContent().classList.contains('content-class-NEW')).to.be.true
    expect(Swal.getInput().classList.contains('input-class-NEW')).to.be.true
    expect(Swal.getActions().classList.contains('actions-class-NEW')).to.be.true
    expect(Swal.getConfirmButton().classList.contains('confirm-button-class-NEW')).to.be.true
    expect(Swal.getCancelButton().classList.contains('cancel-button-class-NEW')).to.be.true
    expect(Swal.getFooter().classList.contains('footer-class-NEW')).to.be.true
  })

  it('isUpdatableParameter() method', () => {
    expect(Swal.isUpdatableParameter('title')).to.be.true
    assert.notOk(Swal.isUpdatableParameter('preConfirm'))
  })

  it('should update instance\'s params', () => {
    const swal = Swal.fire({ icon: 'error' })
    expect(swal.params.icon).to.equal('error')
    swal.update({ icon: 'warning' })
    expect(swal.params.icon).to.equal('warning')
  })

  it('should not affect input', () => {
    Swal.fire({
      input: 'select',
      inputOptions: {
        uno: 'uno',
        dos: 'dos',
        tres: 'tres'
      }
    })
    Swal.getInput().value = 'dos'
    Swal.update({ html: 'hi' })
    expect(Swal.getInput().value).to.equal('dos')
  })

  it('should not affect showClass', (done) => {
    Swal.fire({
      icon: 'success',
      onOpen: () => {
        Swal.update({})
        expect(Swal.getContainer().classList.contains('swal2-backdrop-show')).to.be.true
        expect(Swal.getPopup().classList.contains('swal2-show')).to.be.true
        expect(Swal.getIcon().classList.contains('swal2-icon-show')).to.be.true
        done()
      }
    })
  })

  it('update() method should throw a warning when attempting to update the closing popup', (done) => {
    const spy = cy.spy(console, 'warn')
    Swal.fire().then(() => {
      Swal.update()
      expect(spy.calledWith(`SweetAlert2: You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.`)).to.be.true
      done()
    })
    Swal.clickConfirm()
  })
})
