import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module as MenuModule } from './entities/module.entity';
import { Screen } from './entities/screen.entity';
import { RolePermission } from '../role/entities/role-permission.entity';
import { Action } from '../actions/entities/action.entity';

@Injectable()
export class MenuCreatorService {
  constructor(
    @InjectRepository(MenuModule)
    private readonly menuModuleRepository: Repository<MenuModule>,
    @InjectRepository(Screen)
    private readonly screenRepository: Repository<Screen>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>
  ) { }

  async getMenu(): Promise<any> {
    const modules = await this.menuModuleRepository.find({
      where: { deleted: false },
      relations: ['screens'],
    });
    const actions = await this.actionRepository.find();
    const result = modules
      .filter(module => !module.parentModuleId)
      .map(module => {
        const subModules = modules.filter(
          subModule => subModule.parentModuleId === module.id,
        );

        return {
          moduleId: module.id,
          moduleName: module.name,
          type: module.type,
          moduleRoute: module.route,
          deleteModule: module.deleted,
          subModules: subModules.map(subModule => {
            const subModuleScreens = subModule.screens || [];

            return {
              subModuleId: subModule.id,
              subModuleName: subModule.name,
              subModuleRoute: subModule.route,
              deleteSubModule: subModule.deleted,
              subModuleScreens: subModuleScreens.map((screen: Screen) => ({
                screenId: screen.id,
                screenName: screen.name,
                screenRoute: screen.route,
                // actions: screen.actionIds,
                actions: screen.actionIds.map(actionId => {
                  const action = actions.find(action => action.id === actionId);
                  return {
                    id: actionId,
                    name: action ? action.name : 'Unknown',
                    hasPermission: screen.actionIds.includes(actionId),
                  };
                }),
                deleteScreen: screen.deleted,
              })),
            };
          }),
          screens: module.screens.map((screen: Screen) => ({
            screenId: screen.id,
            screenName: screen.name,
            screenRoute: screen.route,
            // actions: screen.actionIds,
            actions: screen.actionIds.map(actionId => {
              const action = actions.find(action => action.id === actionId);
              return {
                id: actionId,
                name: action ? action.name : 'Unknown',
                hasPermission: screen.actionIds.includes(actionId),
              };
            }),
            deleteScreen: screen.deleted,
          })),
        };
      });

    return result;
  }

  async createOrUpdateMenu(data: any[]): Promise<{ message: string }> {
    for (const moduleData of data) {
      const { moduleId, moduleName, type, moduleRoute, ParentModuleId, subModules, screens, deleteModule } = moduleData;

      // Module 
      let module: MenuModule;

      if (moduleId === null) {
        module = new MenuModule();
      } else {
        module = await this.menuModuleRepository.findOne({ where: { id: moduleId, deleted: false } });
        if (!module) {
          throw new NotFoundException(`Module with ID ${moduleId} not found`);
        }
        if (module?.systemDefault) {
          throw new Error(`Module with ID ${moduleId} is system default and cannot be modified.`);
        }
      }

      // Delete Module
      if (deleteModule && module) {
        module.deleted = true;
        await this.menuModuleRepository.save(module);
        continue;
      }

      // Creating/updating the module
      module.name = moduleName;
      module.type = type;
      module.route = moduleRoute;
      module.parentModuleId = ParentModuleId;
      module.deleted = false;
      await this.menuModuleRepository.save(module);

      // Handle Submodules
      if (subModules) {
        for (const subModuleData of subModules) {
          const { subModuleId, subModuleName, subModuleRoute, subModuleScreens, deleteSubModule } = subModuleData;

          let subModule: MenuModule;

          if (subModuleId === null) {
            subModule = new MenuModule();
          } else {
            subModule = await this.menuModuleRepository.findOne({ where: { id: subModuleId, deleted: false } });
            if (!subModule) {
              throw new NotFoundException(`SubModule with ID ${subModuleId} not found`);
            }
            if (subModule?.systemDefault) {
              throw new Error(`Sub Module with ID ${subModuleId} is system default and cannot be modified.`);
            }
          }

          if (deleteSubModule && subModule) {
            subModule.deleted = true;
            await this.menuModuleRepository.save(subModule);
            continue;
          }

          subModule.name = subModuleName;
          subModule.type = 'submodule';
          subModule.route = subModuleRoute;
          subModule.parentModuleId = module.id;
          subModule.deleted = false;
          await this.menuModuleRepository.save(subModule);

          // Handle screens for submodules
          if (subModuleScreens) {
            for (const screenData of subModuleScreens) {
              const { screenId, screenName, screenRoute, actions, deleteScreen } = screenData;

              let screen: Screen;

              if (screenId === null) {
                screen = new Screen();
              } else {
                screen = await this.screenRepository.findOne({ where: { id: screenId, deleted: false } });

                if (!screen) {
                  throw new NotFoundException(`Screen with ID ${screenId} not found`);
                }
                if (screen?.systemDefault) {
                  throw new Error(`Screen with ID ${screenId} is system default and cannot be modified.`);
                }
              }

              if (deleteScreen && screen) {
                screen.deleted = true;
                await this.screenRepository.save(screen);
                continue;
              }

              screen.name = screenName;
              screen.module = subModule;
              screen.route = screenRoute;
              screen.actionIds = actions;
              screen.deleted = false;
              await this.screenRepository.save(screen);
            }
          }
        }
      }

      // Handle Screens for the main module
      if (screens) {
        for (const screenData of screens) {
          const { screenId, screenName, screenRoute, actions, deleteScreen } = screenData;

          let screen: Screen;

          if (screenId === null) {
            screen = new Screen();
          } else {
            screen = await this.screenRepository.findOne({ where: { id: screenId, deleted: false } });

            if (!screen) {
              throw new NotFoundException(`Screen with ID ${screenId} not found`);
            }
            if (screen?.systemDefault) {
              throw new Error(`Screen with ID ${screenId} is system default and cannot be modified.`);
            }
          }

          if (deleteScreen && screen) {
            screen.deleted = true;
            await this.screenRepository.save(screen);
            continue;
          }

          screen.name = screenName;
          screen.module = module;
          screen.route = screenRoute;
          screen.actionIds = actions;
          screen.deleted = false;
          await this.screenRepository.save(screen);
        }
      }
    }

    return { message: 'Operation completed successfully' };
  }

  async getMenuByRoleId(roleId: number): Promise<any> {
    const rolePermissions = await this.rolePermissionRepository.find({
      where: { roleId: roleId },
    });

    const screenIds = rolePermissions
      .filter(permission => permission.screenId)
      .map(permission => permission.screenId);

    const actions = await this.actionRepository.find();

    const modules = await this.menuModuleRepository.find({
      where: { deleted: false },
      relations: ['screens'],
    });

    const filteredModules = modules
      .filter(module => module.screens.some(screen => screenIds.includes(screen.id)) ||
        modules.some(subModule => subModule.parentModuleId === module.id && subModule.screens.some(screen => screenIds.includes(screen.id))));

    const result = filteredModules
      .filter(module => !module.parentModuleId)
      .map(module => {
        const subModules = filteredModules.filter(
          subModule => subModule.parentModuleId === module.id,
        );

        return {
          moduleId: module.id,
          moduleName: module.name,
          type: module.type,
          moduleRoute: module.route,
          deleteModule: module.deleted,
          subModules: subModules.map(subModule => {
            const subModuleScreens = subModule.screens.filter(screen => screenIds.includes(screen.id));

            return {
              subModuleId: subModule.id,
              subModuleName: subModule.name,
              subModuleRoute: subModule.route,
              deleteSubModule: subModule.deleted,
              subModuleScreens: subModuleScreens.map((screen: Screen) => ({
                screenId: screen.id,
                screenName: screen.name,
                screenRoute: screen.route,
                actions: actions.map(action => ({
                  id: action.id,
                  name: action.name,
                  hasPermission: screen.actionIds.includes(action.id),
                })),
                deleteScreen: screen.deleted,
              })),
            };
          }),
          screens: module.screens.filter(screen => screenIds.includes(screen.id)).map((screen: Screen) => ({
            screenId: screen.id,
            screenName: screen.name,
            screenRoute: screen.route,
            actions: actions.map(action => ({
              id: action.id,
              name: action.name,
              hasPermission: screen.actionIds.includes(action.id),
            })),
            deleteScreen: screen.deleted,
          })),
        };
      });

    return result;
  }

  async getActionsForScreen(screenId: number) {
    const screen = await this.screenRepository.findOne({
      where: { id: screenId },
    });

    if (!screen) {
      throw new NotFoundException(`Screen with ID ${screenId} not found`);
    }

    const actions = await this.actionRepository.findByIds(screen.actionIds);

    return actions.map(action => ({
      id: action.id,
      name: action.name,
    }));
  }

}
