export default {
  // example structure for handling api endpoints based on business entities
  // please keep these in alphabetical order and group them if they extend off the same initial url
  // examples: '/examples',
  // examplesNumbers: '/examples/numbers',
  //
  // can be called with the api filter like so
  // this.$api.get(inventoryService.examples, { id: entryId })
  accessionJobs: '/accession-jobs/',
  barcodes: '/barcodes/',
  barcodesValue: '/barcodes/value/',
  containerTypes: '/container-types/',
  items: '/items/',
  mediaTypes: '/media-types/',
  nonTrayItems: '/non_tray_items/',
  nonTrayItemsBarcode: '/non_tray_items/barcode/',
  owners: '/owners/',
  ownersTiers: '/owners/tiers/',
  sizeClass: '/size_class/',
  trays: '/trays/',
  traysBarcode: '/trays/barcode/',
  verificationJobs: '/verification-jobs/'
}