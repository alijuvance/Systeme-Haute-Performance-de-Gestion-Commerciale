"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotsModule = void 0;
const common_1 = require("@nestjs/common");
const depots_controller_1 = require("./depots.controller");
const depots_service_1 = require("./depots.service");
let DepotsModule = class DepotsModule {
};
exports.DepotsModule = DepotsModule;
exports.DepotsModule = DepotsModule = __decorate([
    (0, common_1.Module)({
        controllers: [depots_controller_1.DepotsController],
        providers: [depots_service_1.DepotsService]
    })
], DepotsModule);
//# sourceMappingURL=depots.module.js.map