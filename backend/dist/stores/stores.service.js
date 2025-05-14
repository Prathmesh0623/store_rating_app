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
exports.StoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_entity_1 = require("./entities/store.entity");
let StoresService = class StoresService {
    constructor(storeRepository) {
        this.storeRepository = storeRepository;
    }
    async findAll() {
        try {
            const stores = await this.storeRepository.find({ relations: ['owner'] });
            return stores || [];
        }
        catch (error) {
            console.error('Error fetching all stores:', error.message);
            return [];
        }
    }
    async findByOwner(ownerId) {
        try {
            const stores = await this.storeRepository.find({ where: { ownerId }, relations: ['owner'] });
            return stores || [];
        }
        catch (error) {
            console.error('Error fetching stores for owner:', error.message);
            return [];
        }
    }
    async findOneById(id) {
        try {
            return await this.storeRepository.findOne({ where: { id }, relations: ['owner'] });
        }
        catch (error) {
            console.error('Error fetching store by ID:', error.message);
            return null;
        }
    }
    async create(createStoreDto, ownerId) {
        const store = this.storeRepository.create(Object.assign(Object.assign({}, createStoreDto), { ownerId }));
        const savedStore = await this.storeRepository.save(store);
        return Array.isArray(savedStore) ? savedStore[0] : savedStore;
    }
    async remove(id, user) {
        const store = await this.storeRepository.findOne({ where: { id }, relations: ['owner'] });
        if (!store) {
            throw new common_1.ForbiddenException('Store not found');
        }
        if (user.role !== 'ADMIN' && store.ownerId !== user.sub) {
            throw new common_1.ForbiddenException('You can only delete your own stores');
        }
        await this.storeRepository.delete(id);
    }
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StoresService);
//# sourceMappingURL=stores.service.js.map