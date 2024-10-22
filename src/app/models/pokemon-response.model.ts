import { ApiResponseModel } from "./api-response.model";

export class PokemonResponse extends ApiResponseModel {
  constructor(response: any) {
    super(response);
  }

  protected processResponse(response: any): void {
      
  }
}

export interface Pokemon {
  id: number,
  name: string,
  sprites: {
    front_default: string,
  },
  hasBeenViewedOnJobList?: boolean,
}