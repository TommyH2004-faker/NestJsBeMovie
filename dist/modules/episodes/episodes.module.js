"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpisodesModule = void 0;
const common_1 = require("@nestjs/common");
const episodes_service_1 = require("./episodes.service");
const episodes_controller_1 = require("./episodes.controller");
const typeorm_module_1 = require("@nestjs/typeorm/dist/typeorm.module");
const episode_entity_1 = require("../../entity/episode.entity");
let EpisodesModule = class EpisodesModule {
};
exports.EpisodesModule = EpisodesModule;
exports.EpisodesModule = EpisodesModule = __decorate([
    (0, common_1.Module)({
        controllers: [episodes_controller_1.EpisodesController],
        providers: [episodes_service_1.EpisodesService],
        exports: [episodes_service_1.EpisodesService],
        imports: [typeorm_module_1.TypeOrmModule.forFeature([episode_entity_1.Episode])],
    })
], EpisodesModule);
//# sourceMappingURL=episodes.module.js.map