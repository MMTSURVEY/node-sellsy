
import ERRORS from './ERRORS';

export default class Documents {
  constructor(sellsy) {
    //this.udpate = ::this.create;
    this.sellsy = sellsy;
  }
  create(data) {
    let method = data.docid ? 'update':'create';
    return this.sellsy.api({
      method: `Document.${method}`,
      params: data
    }).then(result => {
     if (result.status === 'success') {
       return this.getById(data.document.doctype, result.response.doc_id);
     }
     throw new Error(ERRORS.DOCUMENT_CREATE_ERROR);
   }).catch(e => {
     throw new Error(e);
   })
  }
  getById(docType, docId) {
    return this.sellsy.api({
      method: 'Document.getOne',
      params: {
        doctype: docType,
        docid: docId
      }
    }).then(data => {
      return data.response
    }).catch(e => {
      throw new Error(ERRORS.DOCUMENT_NOT_FOUND);
    });
  }
}
