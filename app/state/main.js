import fixtures from '../fixtures'
import reactor from './reactor'
import stores from './stores'
import designsStore from './stores/designs'
import currentDesignIdStore from './stores/currentDesignId'
import {idsToObjs, hydrateDesign} from './helpers'
import getters from './getters'
import {usersRef, firebaseRef} from './firebaseRefs'
var Nuclear = require('nuclear-js')

reactor.registerStores({
  users: stores.usersStore,
  currentUser: stores.currentUserStore,
  designs: designsStore,
  currentDesignId: currentDesignIdStore,
  colorPalettes: stores.colorPalettesStore,
  layerImages: stores.layerImagesStore,
  layerImageUploaded: stores.layerImageUploadedStore,
  currentLayerId: stores.currentLayerIdStore,
  surfaces: stores.surfacesStore,
  validEditSteps: stores.validEditSteps
})

////////////////////////////////////////////////////////////////////////////////
// Exports.
////////////////////////////////////////////////////////////////////////////////

module.exports = {
  getters: getters,
  actions: {
    selectDesignId(id) { reactor.dispatch('selectDesignId', id) },
    selectDesignAndLayerId(ids) { reactor.dispatch('selectDesignAndLayerId', ids) },
    previousDesignColors() { reactor.dispatch('previousDesignColors') },
    nextDesignColors() { reactor.dispatch('nextDesignColors') },
    selectLayerId(id)  { reactor.dispatch('selectLayerId', id) },
    selecteLayerImageId(id) { reactor.dispatch('selectLayerImageId', id) },
    deleteLayerImage(layerImage) { reactor.dispatch('deleteLayerImage', layerImage) },
    uploadLayerImageToS3(file) { reactor.dispatch('uploadLayerImageToS3', file) },
    uploadLayerImageWithCompositeToS3(files) { reactor.dispatch('uploadLayerImageWithCompositeToS3', files) },
    selectColorPaletteId(id) { reactor.dispatch('selectColorPaletteId', id) },
    deleteColorPalette(colorPalette) { reactor.dispatch('deleteColorPalette', colorPalette) },
    selectSurfaceId(id) { reactor.dispatch('selectSurfaceId', id) },
    makeDesignCopy(newId) { reactor.dispatch('makeDesignCopy', newId) },
    createNewDesign(newDesign) { reactor.dispatch('createNewDesign', newDesign) },
    loadAdminCreateDesignData() { reactor.dispatch('loadAdminCreateDesignData') },
    loadAdminCreatedDesigns() { reactor.dispatch('loadAdminCreatedDesigns') },
    loadAdminColorPalettes() { reactor.dispatch('loadAdminColorPalettes') },
    loadAdminLayerImages() { reactor.dispatch('loadAdminLayerImages') },
    loadCurrentDesignEditResources() { reactor.dispatch('loadCurrentDesignEditResources') },
    createNewUser(userProps) { reactor.dispatch('createNewUser', userProps) },
    createNewUserAndSetAsCurrent(userProps) { reactor.dispatch('createNewUserAndSetAsCurrent', userProps) },
    setCurrentUser(currentUser) { reactor.dispatch('setCurrentUser', currentUser) },
    logoutCurrentUser() { reactor.dispatch('logoutCurrentUser') },
    saveColorPalette(colorPalette) { reactor.dispatch('saveColorPalette', colorPalette) },
    createNewColorPalette(colorPalette) { reactor.dispatch('createNewColorPalette', colorPalette) }
  }
}

firebaseRef.onAuth(authData => {
  if (authData) {
    usersRef.child(authData.uid).once('value', s => {
      var existingUser = s.val()
      if (existingUser == null) {
        let userData = {
          id: authData.uid,
          name: authData.google.displayName,
          email: authData.google.email,
          isAdmin: false}
        reactor.dispatch('createNewUserAndSetAsCurrent', userData)
      } else {
        existingUser.id = s.key()
        reactor.dispatch('setCurrentUser', existingUser)
      }
    })
  } else {
    console.log("User is logged out");
  }
})
