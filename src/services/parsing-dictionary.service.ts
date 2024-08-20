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

  public static async createParsingDictionary(data: {
    carrier: string;
    dictionary: Record<string, string>;
  }): Promise<IParsingDictionary> {
    console.log('createParsingDictionary started');
    console.log('Input data:', JSON.stringify(data, null, 2));
    try {
      // Convert dictionary to array of key-value pairs
      const dictionaryArray = Object.entries(data.dictionary).map(
        ([key, value]) => ({ key, value }),
      );

      // Check if a dictionary for this carrier already exists
      const existingDictionary = await this.getParsingDictionaryByCarrier(
        data.carrier,
      );

      if (existingDictionary) {
        console.log(
          `Existing dictionary found for carrier ${data.carrier}. Updating...`,
        );
        const updatedDictionary: IParsingDictionary = await this.collection
          .where('carrier', '==', data.carrier)
          .get()
          .then((snapshot) => {
            if (!snapshot.empty) {
              const doc = snapshot.docs[0];
              return doc.ref
                .update({ dictionary: dictionaryArray })
                .then(() => ({
                  id: doc.id,
                  carrier: data.carrier,
                  dictionary: dictionaryArray,
                }));
            }
            throw new Error(`No document found for carrier ${data.carrier}`);
          });

        console.log(
          'ParsingDictionary updated successfully:',
          JSON.stringify(updatedDictionary, null, 2),
        );
        return updatedDictionary;
      }

      // If no existing dictionary, create a new one
      console.log(
        `No existing dictionary found for carrier ${data.carrier}. Creating new one...`,
      );
      const docRef = await this.collection.add({
        carrier: data.carrier,
        dictionary: dictionaryArray,
      });
      const newDoc = await docRef.get();
      const newParsingDictionary = {
        id: newDoc.id,
        carrier: data.carrier,
        dictionary: dictionaryArray,
      } as IParsingDictionary;
      console.log(
        'New ParsingDictionary created successfully:',
        JSON.stringify(newParsingDictionary, null, 2),
      );
      return newParsingDictionary;
    } catch (error) {
      console.error('Error creating/updating ParsingDictionary:', error);
      throw error;
    }
  }
  public static async updateParsingDictionary(
    id: string,
    data: Partial<Omit<IParsingDictionary, 'id'>>,
  ): Promise<IParsingDictionary | null> {
    console.log(`Updating parsing dictionary with id ${id}`);
    console.log('Update data:', JSON.stringify(data, null, 2));
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        console.error(`Document with id ${id} not found`);
        return null;
      }

      await docRef.update(data);
      const updatedDoc = await docRef.get();
      const updatedDictionary = {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      } as IParsingDictionary;
      console.log(
        'Updated dictionary:',
        JSON.stringify(updatedDictionary, null, 2),
      );
      return updatedDictionary;
    } catch (error) {
      console.error(`Error updating parsing dictionary with id ${id}:`, error);
      return null; // Return null instead of throwing an error
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
      if (snapshot.docs.length > 0) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        return {
          id: doc.id,
          carrier: data.carrier,
          dictionary: data.dictionary,
        } as IParsingDictionary;
      }
      return null;
    } catch (error) {
      console.error(
        `Error getting parsing dictionary with carrier ${carrier}:`,
        error,
      );
      throw error;
    }
  }
}
