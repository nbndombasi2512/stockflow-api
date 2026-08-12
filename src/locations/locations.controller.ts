import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { CreateLocationDto } from "./dto/create-location.dto";
import { ListLocationsQueryDto } from "./dto/list-locations-query.dto";
import { LocationResponseDto } from "./dto/location-response.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import {
  LocationsService,
  type LocationResult,
} from "./locations.service";

@ApiTags("locations")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Missing or invalid JWT" })
@Controller("locations")
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a location" })
  @ApiCreatedResponse({ type: LocationResponseDto })
  create(@Body() dto: CreateLocationDto): Promise<LocationResult> {
    return this.locationsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List locations" })
  @ApiOkResponse({ type: LocationResponseDto, isArray: true })
  findAll(@Query() query: ListLocationsQueryDto): Promise<LocationResult[]> {
    return this.locationsService.findAll(query.includeArchived ?? false);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a location by id" })
  @ApiOkResponse({ type: LocationResponseDto })
  @ApiNotFoundResponse({ description: "Location not found" })
  findOne(@Param("id", ParseUUIDPipe) id: string): Promise<LocationResult> {
    return this.locationsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update or archive a location" })
  @ApiOkResponse({ type: LocationResponseDto })
  @ApiNotFoundResponse({ description: "Location not found" })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateLocationDto,
  ): Promise<LocationResult> {
    return this.locationsService.update(id, dto);
  }
}
