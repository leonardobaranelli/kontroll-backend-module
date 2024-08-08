import { IParsingDictionary } from '../utils/types/models.interface';
import { getParsingDictionariesCollection } from '../config/database/firestore/firestore.config';

export default class ParsingDictionaryService {
  private static collection = getParsingDictionariesCollection();

  public static async getAllParsingDictionaries(): Promise<
    IParsingDictionary[]
  > {
    try {
      const snapshot = await this.collection.get();
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as IParsingDictionary,
      );
    } catch (error) {
      console.error('Error getting all parsing dictionaries:', error);
      throw error;
    }
  }

  public static async getParsingDictionaryById(
    id: string,
  ): Promise<IParsingDictionary | null> {
    try {
      const doc = await this.collection.doc(id).get();
      return doc.exists
        ? ({ id: doc.id, ...doc.data() } as IParsingDictionary)
        : null;
    } catch (error) {
      console.error(`Error getting parsing dictionary with id ${id}:`, error);
      throw error;
    }
  }

  public static async createParsingDictionary(
    data: Omit<IParsingDictionary, 'id'>,
  ): Promise<IParsingDictionary> {
    try {
      const docRef = await this.collection.add(data);
      const newDoc = await docRef.get();
      return { id: newDoc.id, ...newDoc.data() } as IParsingDictionary;
    } catch (error) {
      console.error('Error creating parsing dictionary:', error);
      throw error;
    }
  }

  public static async updateParsingDictionary(
    id: string,
    data: Partial<IParsingDictionary>,
  ): Promise<IParsingDictionary | null> {
    try {
      await this.collection.doc(id).update(data);
      const updatedDoc = await this.collection.doc(id).get();
      return updatedDoc.exists
        ? ({ id: updatedDoc.id, ...updatedDoc.data() } as IParsingDictionary)
        : null;
    } catch (error) {
      console.error(`Error updating parsing dictionary with id ${id}:`, error);
      throw error;
    }
  }

  public static async deleteParsingDictionary(id: string): Promise<void> {
    try {
      await this.collection.doc(id).delete();
    } catch (error) {
      console.error(`Error deleting parsing dictionary with id ${id}:`, error);
      throw error;
    }
  }

  public static async getParsingDictionaryByCarrier(
    carrier: string,
  ): Promise<IParsingDictionary | null> {
    try {
      const snapshot = await this.collection
        .where('carrier', '==', carrier)
        .get();
      return snapshot.docs.length > 0
        ? ({
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data(),
          } as IParsingDictionary)
        : null;
    } catch (error) {
      console.error(
        `Error getting parsing dictionary with carrier ${carrier}:`,
        error,
      );
      throw error;
    }
  }
}
