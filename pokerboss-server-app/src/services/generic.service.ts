import admin from 'firebase-admin'
import { WhereFilterOp } from 'firebase-admin/firestore'

interface FindKeyByKeyArgs {
  field: string
  operator: WhereFilterOp
  value: any
}

/**
 * generic service to handle common operations across
 */
export class GenericService<T> {
  private collectioRef: admin.firestore.CollectionReference<admin.firestore.DocumentData>

  /**
   * constructor to set collectioRef as per the collection name
   *  @param {string} collectionName name of a collection
   */
  constructor(collectionName: string) {
    this.collectioRef = admin.firestore().collection(collectionName)
  }

  /**
   * to add a new record to a Firestore collection
   *  @param {T} payload payload to be added as the new record
   */
  async createRecord(payload: T): Promise<T | Error> {
    try {
      const response = await this.collectioRef.add(payload)
      const data = await response.get()
      return data.data() as T
    } catch (error) {
      throw new Error('Error while creating record')
    }
  }

  /**
   * Firestore collection based on multiple search parameters specified in the FindKeyByKeyArgs type
   *  @param {FindKeyByKeyArgs[]} params an array of FindKeyByKeyArgs objects that define the search parameters for the Firestore query
   */
  async getRecordsByKeys(params: FindKeyByKeyArgs[]): Promise<T[] | Error> {
    try {
      let query: admin.firestore.Query<admin.firestore.DocumentData> = this.collectioRef
      params.forEach(({ field, operator, value }) => {
        query = query.where(field, operator, value)
      })
      const response = await query.get()

      if (response.empty) throw 'Record does not exists'

      const data = response.docs.map((item) => ({ id: item.id, ...item.data() }))
      return data as T[]
    } catch (error) {
      throw new Error(typeof error === 'string' ? error : 'Error while retrieving record by key')
    }
  }

  /**
   * to retrieve a specific record from a Firestore collection based on its unique recordId
   *  @param {string} recordId string representing the unique identifier of the record to be retrieved
   */
  async getRecordById(recordId: string): Promise<T | Error> {
    try {
      const response = await this.collectioRef.doc(recordId)
      const data = await response.get()

      if (!data.exists) throw 'Record does not exists'

      return data.data() as T
    } catch (error) {
      throw new Error(typeof error === 'string' ? error : 'Error while retrieving record by Id')
    }
  }

  /**
   * to retrieve a paginated list of records from a Firestore collection based on different parameters
   *  @param {number} page number representing the page number of the paginated results
   *  @param {number} perPage number representing the number of records per page in the paginated results
   *  @param {string} sortBy number representing the number of records per page in the paginated results
   *  @param {string} sortOrder number representing the number of records per page in the paginated results
   *  @param {string} filterField number representing the number of records per page in the paginated results
   *  @param {any} filterValue number representing the number of records per page in the paginated results
   */
  async getRecords(
    page = 1,
    perPage = 10,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    filterField: string | null = null,
    filterValue: any = null,
  ): Promise<T[]> {
    try {
      let query: admin.firestore.Query<admin.firestore.DocumentData> = this.collectioRef

      if (filterField && filterValue !== null) {
        query = query.where(filterField, '==', filterValue)
      }

      query = query.orderBy(sortBy, sortOrder)
      const startAtDoc = await query
        .offset((page - 1) * perPage)
        .limit(perPage)
        .get()

      if (startAtDoc.empty) throw 'Record does not exists'

      const response = await query.startAfter(startAtDoc.docs[0]).limit(perPage).get()

      const data = response.docs.map((item) => ({ id: item.id, ...item.data() }))
      return data as T[]
    } catch (error) {
      throw new Error(typeof error === 'string' ? error : 'Error while retrieving record by Id')
    }
  }

  /**
   * to update an existing record in a Firestore collection based on the provided recordId and updatedData
   *  @param {string} recordId string representing the unique identifier of the record to be updated
   *  @param {string} updatedData partial object of type T representing the updated data to be merged with the existing record
   */
  async updateRecord(recordId: string, updatedData: Partial<T>): Promise<string> {
    try {
      await this.collectioRef.doc(recordId).update({ ...updatedData })
      return 'Record updated successfully'
    } catch (error) {
      throw new Error('Error updating record')
    }
  }

  /**
   * to delete a specific record from a Firestore collection based on the provided recordId
   *  @param {string} recordId string representing the unique identifier of the record to be deleted
   */
  async deleteRecord(recordId: string): Promise<string> {
    try {
      await this.collectioRef.doc(recordId).delete()
      return 'Record deleted successfully'
    } catch (error) {
      throw new Error('Error deleting record')
    }
  }
}
