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
exports.GenresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const genre_entity_1 = require("../../entity/genre.entity");
const Repository_1 = require("typeorm/repository/Repository");
const movie_entity_1 = require("../../entity/movie.entity");
let GenresService = class GenresService {
    genresRepository;
    moviesRepository;
    constructor(genresRepository, moviesRepository) {
        this.genresRepository = genresRepository;
        this.moviesRepository = moviesRepository;
    }
    findAll() {
        return this.genresRepository.find();
    }
    async create(data) {
        const existingGenre = await this.genresRepository.findOne({
            where: [{ name: data.name }, { slug: data.slug }],
        });
        if (existingGenre) {
            throw new common_1.BadRequestException(`Genre with name "${data.name}" or slug "${data.slug}" already exists.`);
        }
        const genre = this.genresRepository.create(data);
        return this.genresRepository.save(genre);
    }
    async deleteGenre(id) {
        const genre = await this.genresRepository.findOneBy({ id });
        if (!genre) {
            throw new common_1.BadRequestException(`Genre with ID ${id} does not exist.`);
        }
        await this.genresRepository.remove(genre);
    }
    async update(id, updateDto) {
        const genre = await this.genresRepository.findOne({ where: { id } });
        if (!genre) {
            throw new common_1.NotFoundException(`Genre with ID ${id} not found`);
        }
        if (updateDto.name)
            genre.name = updateDto.name;
        if (updateDto.slug)
            genre.slug = updateDto.slug;
        const saved = await this.genresRepository.save(genre);
        return saved;
    }
    async findMoviesByGenre(genreId, page, size, sort) {
        const [movies, total] = await this.moviesRepository.findAndCount({
            where: { genres: { id: genreId } },
            relations: ['genres'],
            order: { [sort]: 'ASC' },
            skip: (page - 1) * size,
            take: size,
        });
        return { movies, total };
    }
    async getTotalGenres() {
        return this.genresRepository.count();
    }
    async get5genreNew() {
        return this.genresRepository.find({
            order: { created_at: 'DESC' },
            take: 5,
        });
    }
    async findMovieByGenreSlug(slug, size) {
        return this.genresRepository.find({
            where: { slug },
            relations: ['movies'],
            take: size || undefined,
        });
    }
    async getGenreById(id) {
        const genre = await this.genresRepository.findOneBy({ id });
        if (!genre) {
            throw new common_1.NotFoundException(`Genre with ID ${id} not found`);
        }
        return genre;
    }
};
exports.GenresService = GenresService;
exports.GenresService = GenresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(genre_entity_1.Genre)),
    __param(1, (0, typeorm_1.InjectRepository)(movie_entity_1.Movie)),
    __metadata("design:paramtypes", [Repository_1.Repository,
        Repository_1.Repository])
], GenresService);
//# sourceMappingURL=genres.service.js.map