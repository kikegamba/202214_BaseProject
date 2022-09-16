export function BusinessLogicException(message: string, type: number) {
    this.message = message;
    this.type = type;
  }
  
  export enum BusinessError {
    NOT_FOUND,
    PRECONDITION_FAILED,
    BAD_REQUEST
  }

  export enum CountryList {
    ARGENTINA = "Argentina",
    PARAGUAY = "Paraguay",
    ECUADOR = "Ecuador"
  }

  export function validateCountry(country: string) {
    return country  in CountryList
}
