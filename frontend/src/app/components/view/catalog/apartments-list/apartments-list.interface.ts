import {IApartment} from "@src/app/interfaces/apartments.interface";

export interface IApartmentWithImage extends IApartment {
  image?: string;
}
