import { IParsingDictionary } from '../utils/types/models.interface';

type MaybeString = string | null;

export class ParsingDictionary implements IParsingDictionary {
  id!: MaybeString;
  dictionary!: JSON;
  carrier!: MaybeString;
}
