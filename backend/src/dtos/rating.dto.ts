export class CreateRatingDto {
  rating: number;
  review: string;
  storeId: number;
}

export class UpdateRatingDto {
  rating?: number;
  review?: string;
}