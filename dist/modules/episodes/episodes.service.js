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
exports.EpisodesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const episode_entity_1 = require("../../entity/episode.entity");
const Repository_1 = require("typeorm/repository/Repository");
let EpisodesService = class EpisodesService {
    episodeRepository;
    constructor(episodeRepository) {
        this.episodeRepository = episodeRepository;
    }
    findByMovie(movieId) {
        return this.episodeRepository.find({
            where: { movie: { id: movieId } },
            order: { episode_number: 'ASC' },
        });
    }
    create(data) {
        const ep = this.episodeRepository.create(data);
        return this.episodeRepository.save(ep);
    }
    delete(episode_number, movieId) {
        return this.episodeRepository.delete({ episode_number, movie: { id: movieId } });
    }
    async update(episode_number, movieId, data) {
        const episode = await this.episodeRepository.findOne({
            where: { episode_number, movie: { id: movieId } },
            relations: ['movie'],
        });
        if (!episode)
            return null;
        Object.assign(episode, data);
        return this.episodeRepository.save(episode);
    }
};
exports.EpisodesService = EpisodesService;
exports.EpisodesService = EpisodesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __metadata("design:paramtypes", [Repository_1.Repository])
], EpisodesService);
//# sourceMappingURL=episodes.service.js.map