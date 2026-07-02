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
exports.DepotsController = void 0;
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const common_1 = require("@nestjs/common");
const depots_service_1 = require("./depots.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let DepotsController = class DepotsController {
    depotsService;
    constructor(depotsService) {
        this.depotsService = depotsService;
    }
    findAll() {
        return this.depotsService.findAll();
    }
    create(body) {
        return this.depotsService.create(body);
    }
};
exports.DepotsController = DepotsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DepotsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DepotsController.prototype, "create", null);
exports.DepotsController = DepotsController = __decorate([
    (0, common_1.Controller)('depots'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(...['ADMIN']),
    __metadata("design:paramtypes", [depots_service_1.DepotsService])
], DepotsController);
//# sourceMappingURL=depots.controller.js.map