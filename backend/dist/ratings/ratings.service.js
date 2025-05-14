"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rating_entity_1 = require("./entities/rating.entity");
const stores_service_1 = require("../stores/stores.service");
let RatingsService = class RatingsService {
    constructor(ratingRepository, storesService) {
        this.ratingRepository = ratingRepository;
        this.storesService = storesService;
    }
    async findByUser(userId) {
        try {
            return await this.ratingRepository.find({ where: { userId }, relations: ['store'] });
        }
        catch (error) {
            console.error('Error fetching ratings by user:', error.message);
            return [];
        }
    }
    async create(userId, ratingDto) {
        const store = await this.storesService.findOneById(ratingDto.storeId);
        if (!store) {
            throw new common_1.BadRequestException('Store not found');
        }
        const rating = this.ratingRepository.create(Object.assign(Object.assign({}, ratingDto), { userId }));
        const savedRating = await this.ratingRepository.save(rating);
        return Array.isArray(savedRating) ? savedRating[0] : savedRating;
    }
    async update(userId, id, ratingDto) {
        const rating = await this.ratingRepository.findOne({ where: { id, userId } });
        if (!rating) {
            throw new common_1.BadRequestException('Rating not found or you do not have permission to update it');
        }
        Object.assign(rating, ratingDto);
        const updatedRating = await this.ratingRepository.save(rating);
        return Array.isArray(updatedRating) ? updatedRating[0] : updatedRating;
    }
};
exports.RatingsService = RatingsService;
exports.RatingsService = RatingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rating_entity_1.Rating)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        stores_service_1.StoresService])
], RatingsService);
//# sourceMappingURL=ratings.service.js.map