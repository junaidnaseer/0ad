RMS.LoadLibrary("rmgen");

//random terrain textures
var rt = randomizeBiome();

var tGrass = rBiomeT1();
var tGrassPForest = rBiomeT2();
var tGrassDForest = rBiomeT3();
var tCliff = rBiomeT4();
var tGrassA = rBiomeT5();
var tGrassB = rBiomeT6();
var tGrassC = rBiomeT7();
var tHill = rBiomeT1();
var tDirt = rBiomeT9();
var tRoad = rBiomeT10();
var tRoadWild = rBiomeT11();
var tGrassPatch = rBiomeT12();
var tShoreBlend = rBiomeT13();
var tShore = rBiomeT14();
var tWater = rBiomeT15();

// gaia entities
var oOak = rBiomeE1();
var oOakLarge = rBiomeE2();
var oApple = rBiomeE3();
var oPine = rBiomeE4();
var oAleppoPine = rBiomeE5();
var oBerryBush = rBiomeE6();
var oChicken = rBiomeE7();
var oDeer = rBiomeE8();
var oFish = rBiomeE9();
var oSheep = rBiomeE10();
var oStoneLarge = rBiomeE11();
var oStoneSmall = rBiomeE12();
var oMetalLarge = rBiomeE13();

// decorative props
var aGrass = rBiomeA1();
var aGrassShort = rBiomeA2();
var aReeds = rBiomeA3();
var aLillies = rBiomeA4();
var aRockLarge = rBiomeA5();
var aRockMedium = rBiomeA6();
var aBushMedium = rBiomeA7();
var aBushSmall = rBiomeA8();

var pForestD = [tGrassDForest + TERRAIN_SEPARATOR + oOak, tGrassDForest + TERRAIN_SEPARATOR + oOakLarge, tGrassDForest];
var pForestP = [tGrassPForest + TERRAIN_SEPARATOR + oPine, tGrassPForest + TERRAIN_SEPARATOR + oAleppoPine, tGrassPForest];
const BUILDING_ANGlE = -PI/4;


// initialize map

log("Initializing map...");

InitMap();

var numPlayers = getNumPlayers();
var mapSize = getMapSize();
var mapArea = mapSize*mapSize;

log(mapSize);

// create tile classes

var clPlayer = createTileClass();
var clHill = createTileClass();
var clForest = createTileClass();
var clWater = createTileClass();
var clDirt = createTileClass();
var clRock = createTileClass();
var clMetal = createTileClass();
var clFood = createTileClass();
var clBaseResource = createTileClass();
var clSettlement = createTileClass();
var clLand = createTileClass();

//Paint the whole map
	
for (var ix = 0; ix < mapSize; ix++)
{
	for (var iz = 0; iz < mapSize; iz++)
	{
		var x = ix / (mapSize + 1.0);
		var z = iz / (mapSize + 1.0);
			placeTerrain(ix, iz, tWater);
	}
}

	var radius = scaleByMapSize(15,30);
	var cliffRadius = 2;
	var elevation = 20;
// randomize player order

var playerIDs = [];
for (var i = 0; i < numPlayers; i++)
{
	playerIDs.push(i+1);
}
playerIDs = sortPlayers(playerIDs);

// place players

var playerX = new Array(numPlayers);
var playerZ = new Array(numPlayers);
var playerAngle = new Array(numPlayers);

var startAngle = randFloat(0, TWO_PI);
for (var i = 0; i < numPlayers; i++)
{
	playerAngle[i] = startAngle + i*TWO_PI/numPlayers;
	playerX[i] = 0.5 + 0.35*cos(playerAngle[i]);
	playerZ[i] = 0.5 + 0.35*sin(playerAngle[i]);
}

// Creating other islands
var numIslands = 0;
//****************************
//----------------------------
//Tiny and Small Size
//----------------------------
//****************************
if ((mapSize == 128)||(mapSize == 192)){
		//2 PLAYERS
		//-----------------
		//-----------------
	if (numPlayers == 2){
		numIslands = 4*numPlayers+1;
		var IslandX = new Array(numIslands);
		var IslandZ = new Array(numIslands);
		var isConnected = new Array(numIslands);
		for (var q=0; q <numIslands; q++)
		{
			isConnected[q]=new Array(numIslands);
		}
		for (var m = 0; m < numIslands; m++){
			for (var n = 0; n < numIslands; n++){
				isConnected[m][n] = 0;
			}
		}
		//connections
		var sX = 0;
		var sZ = 0;
		for (var l = 0; l < numPlayers; l++)
		{
			isConnected[4*numPlayers][l+2*numPlayers] = 1;
			sX = sX + playerX[l];
			sZ = sZ + playerZ[l];
		}

		var fx = fractionToTiles(sX/numPlayers);
		var fz = fractionToTiles(sZ/numPlayers);
		var ix = round(fx);
		var iz = round(fz);
		IslandX[4*numPlayers]=ix;
		IslandZ[4*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.36);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		//centeral island id numPlayers
		
		for (var e = 0; e <numPlayers; e++)
		{
		isConnected[e+2*numPlayers][e] = 1;
		if (e+2*numPlayers+1<numIslands-numPlayers-1)
		{
			isConnected[e+2*numPlayers][e+2*numPlayers+1] = 1;
		}
		else
		{
			isConnected[2*numPlayers][e+2*numPlayers] = 1;
		}

		var fx = fractionToTiles(0.5 + 0.16*cos(startAngle + e*TWO_PI/numPlayers));
		var fz = fractionToTiles(0.5 + 0.16*sin(startAngle + e*TWO_PI/numPlayers));
		var ix = round(fx);
		var iz = round(fz);
		IslandX[e+2*numPlayers]=ix;
		IslandZ[e+2*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.81);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		
		//Small Isles
		isConnected[e+3*numPlayers][e+numPlayers] = 1;
		var fx = fractionToTiles(0.5 + 0.27*cos(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
		var fz = fractionToTiles(0.5 + 0.27*sin(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
		var ix = round(fx);
		var iz = round(fz);
		IslandX[e+3*numPlayers]=ix;
		IslandZ[e+3*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.49);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		}
		
		for (var e = 0; e <numPlayers; e++)
		{
			isConnected[e][e+numPlayers] = 1;
			if (e+1<numPlayers)
			{
				isConnected[e + 1][e+numPlayers] = 1;
			}
			else
			{
				isConnected[0][e+numPlayers] = 1;
			}
	
			//second island id 4
			var fx = fractionToTiles(0.5 + 0.41*cos(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
			var fz = fractionToTiles(0.5 + 0.41*sin(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
			var ix = round(fx);
			var iz = round(fz);
			IslandX[e+numPlayers]=ix;
			IslandZ[e+numPlayers]=iz;
			// calculate size based on the radius
			var hillSize = PI * radius * radius;
			
			// create the hill
			var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
			var terrainPainter = new LayeredPainter(
				[tCliff, tHill],		// terrains
				[cliffRadius]		// widths
			);
			var elevationPainter = new SmoothElevationPainter(
				ELEVATION_SET,			// type
				elevation,				// elevation
				cliffRadius				// blend radius
			);
			createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		}
	}
		//3 PLAYERS
		//-----------------
		//-----------------
		if (numPlayers == 3){
		numIslands = 4*numPlayers+1;
		var IslandX = new Array(numIslands);
		var IslandZ = new Array(numIslands);
		var isConnected = new Array(numIslands);
		for (var q=0; q <numIslands; q++)
		{
			isConnected[q]=new Array(numIslands);
		}
		for (var m = 0; m < numIslands; m++){
			for (var n = 0; n < numIslands; n++){
				isConnected[m][n] = 0;
			}
		}
		//connections
		var sX = 0;
		var sZ = 0;
		for (var l = 0; l < numPlayers; l++)
		{
			isConnected[4*numPlayers][l+2*numPlayers] = 1;
			sX = sX + playerX[l];
			sZ = sZ + playerZ[l];
		}

		var fx = fractionToTiles(sX/numPlayers);
		var fz = fractionToTiles(sZ/numPlayers);
		var ix = round(fx);
		var iz = round(fz);
		IslandX[4*numPlayers]=ix;
		IslandZ[4*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.36);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		//centeral island id numPlayers
		
		for (var e = 0; e <numPlayers; e++)
		{
		isConnected[e+2*numPlayers][e] = 1;
		if (e+2*numPlayers+1<numIslands-numPlayers-1)
		{
			isConnected[e+2*numPlayers][e+2*numPlayers+1] = 1;
		}
		else
		{
			isConnected[2*numPlayers][e+2*numPlayers] = 1;
		}

		var fx = fractionToTiles(0.5 + 0.16*cos(startAngle + e*TWO_PI/numPlayers));
		var fz = fractionToTiles(0.5 + 0.16*sin(startAngle + e*TWO_PI/numPlayers));
		var ix = round(fx);
		var iz = round(fz);
		IslandX[e+2*numPlayers]=ix;
		IslandZ[e+2*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.81);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		
		//Small Isles
		isConnected[e+3*numPlayers][e+numPlayers] = 1;
		var fx = fractionToTiles(0.5 + 0.27*cos(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
		var fz = fractionToTiles(0.5 + 0.27*sin(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
		var ix = round(fx);
		var iz = round(fz);
		IslandX[e+3*numPlayers]=ix;
		IslandZ[e+3*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.49);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		}
		
		for (var e = 0; e <numPlayers; e++)
		{
			isConnected[e][e+numPlayers] = 1;
			if (e+1<numPlayers)
			{
				isConnected[e + 1][e+numPlayers] = 1;
			}
			else
			{
				isConnected[0][e+numPlayers] = 1;
			}
	
			//second island id 4
			var fx = fractionToTiles(0.5 + 0.41*cos(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
			var fz = fractionToTiles(0.5 + 0.41*sin(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
			var ix = round(fx);
			var iz = round(fz);
			IslandX[e+numPlayers]=ix;
			IslandZ[e+numPlayers]=iz;
			// calculate size based on the radius
			var hillSize = PI * radius * radius;
			
			// create the hill
			var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
			var terrainPainter = new LayeredPainter(
				[tCliff, tHill],		// terrains
				[cliffRadius]		// widths
			);
			var elevationPainter = new SmoothElevationPainter(
				ELEVATION_SET,			// type
				elevation,				// elevation
				cliffRadius				// blend radius
			);
			createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		}
	}

		//4 PLAYERS
		//-----------------
		//-----------------
		if (numPlayers == 4){
		numIslands = 4*numPlayers+1;
		var IslandX = new Array(numIslands);
		var IslandZ = new Array(numIslands);
		var isConnected = new Array(numIslands);
		for (var q=0; q <numIslands; q++)
		{
			isConnected[q]=new Array(numIslands);
		}
		for (var m = 0; m < numIslands; m++){
			for (var n = 0; n < numIslands; n++){
				isConnected[m][n] = 0;
			}
		}
		//connections
		var sX = 0;
		var sZ = 0;
		for (var l = 0; l < numPlayers; l++)
		{
			isConnected[4*numPlayers][l+2*numPlayers] = 1;
			sX = sX + playerX[l];
			sZ = sZ + playerZ[l];
		}

		var fx = fractionToTiles(sX/numPlayers);
		var fz = fractionToTiles(sZ/numPlayers);
		var ix = round(fx);
		var iz = round(fz);
		IslandX[4*numPlayers]=ix;
		IslandZ[4*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.36);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		//centeral island id numPlayers
		
		for (var e = 0; e <numPlayers; e++)
		{
		isConnected[e+2*numPlayers][e] = 1;
		if (e+2*numPlayers+1<numIslands-numPlayers-1)
		{
			isConnected[e+2*numPlayers][e+2*numPlayers+1] = 1;
		}
		else
		{
			isConnected[2*numPlayers][e+2*numPlayers] = 1;
		}

		var fx = fractionToTiles(0.5 + 0.16*cos(startAngle + e*TWO_PI/numPlayers));
		var fz = fractionToTiles(0.5 + 0.16*sin(startAngle + e*TWO_PI/numPlayers));
		var ix = round(fx);
		var iz = round(fz);
		IslandX[e+2*numPlayers]=ix;
		IslandZ[e+2*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.81);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		
		//Small Isles
		isConnected[e+3*numPlayers][e+numPlayers] = 1;
		var fx = fractionToTiles(0.5 + 0.41*cos(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
		var fz = fractionToTiles(0.5 + 0.41*sin(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
		var ix = round(fx);
		var iz = round(fz);
		IslandX[e+3*numPlayers]=ix;
		IslandZ[e+3*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.49);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		}
		
		for (var e = 0; e <numPlayers; e++)
		{
			isConnected[e][e+numPlayers] = 1;
			if (e+1<numPlayers)
			{
				isConnected[e + 1][e+numPlayers] = 1;
			}
			else
			{
				isConnected[0][e+numPlayers] = 1;
			}
	
			//second island id 4
			var fx = fractionToTiles(0.5 + 0.27*cos(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
			var fz = fractionToTiles(0.5 + 0.27*sin(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
			var ix = round(fx);
			var iz = round(fz);
			IslandX[e+numPlayers]=ix;
			IslandZ[e+numPlayers]=iz;
			// calculate size based on the radius
			var hillSize = PI * radius * radius;
			
			// create the hill
			var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
			var terrainPainter = new LayeredPainter(
				[tCliff, tHill],		// terrains
				[cliffRadius]		// widths
			);
			var elevationPainter = new SmoothElevationPainter(
				ELEVATION_SET,			// type
				elevation,				// elevation
				cliffRadius				// blend radius
			);
			createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		}
	}
	
			//More than 4 PLAYERS
		//-----------------
		//-----------------
		if (numPlayers > 4){
		numIslands = numPlayers + 1;
		var IslandX = new Array(numIslands);
		var IslandZ = new Array(numIslands);
		var isConnected = new Array(numIslands);
		for (var q=0; q <numIslands; q++)
		{
			isConnected[q]=new Array(numIslands);
		}
		for (var m = 0; m < numIslands; m++){
			for (var n = 0; n < numIslands; n++){
				isConnected[m][n] = 0;
			}
		}
		//connections
		var sX = 0;
		var sZ = 0;
		for (var l = 0; l < numPlayers; l++)
		{
			isConnected[l][numPlayers] = 1;
			sX = sX + playerX[l];
			sZ = sZ + playerZ[l];
		}
		
		//centeral island id numPlayers
		
		var fx = fractionToTiles((sX)/numPlayers);
		var fz = fractionToTiles((sZ)/numPlayers);
		var ix = round(fx);
		var iz = round(fz);
		IslandX[numPlayers]=ix;
		IslandZ[numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = PI * radius * radius;
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		
		
	}
}

//****************************
//----------------------------
//Medium Size
//----------------------------
//****************************
if (mapSize == 256){
		//2,3,4 PLAYERS
		//-----------------
		//-----------------
		if ((numPlayers == 2)||(numPlayers == 3)||(numPlayers == 4)){
		numIslands = 4*numPlayers+1;
		var IslandX = new Array(numIslands);
		var IslandZ = new Array(numIslands);
		var isConnected = new Array(numIslands);
		for (var q=0; q <numIslands; q++)
		{
			isConnected[q]=new Array(numIslands);
		}
		for (var m = 0; m < numIslands; m++){
			for (var n = 0; n < numIslands; n++){
				isConnected[m][n] = 0;
			}
		}
		//connections
		var sX = 0;
		var sZ = 0;
		for (var l = 0; l < numPlayers; l++)
		{
			isConnected[4*numPlayers][l+2*numPlayers] = 1;
			sX = sX + playerX[l];
			sZ = sZ + playerZ[l];
		}

		var fx = fractionToTiles(sX/numPlayers);
		var fz = fractionToTiles(sZ/numPlayers);
		var ix = round(fx);
		var iz = round(fz);
		IslandX[4*numPlayers]=ix;
		IslandZ[4*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.36);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		//centeral island id numPlayers
		
		for (var e = 0; e <numPlayers; e++)
		{
		isConnected[e+2*numPlayers][e] = 1;
		if (e+2*numPlayers+1<numIslands-numPlayers-1)
		{
			isConnected[e+2*numPlayers][e+2*numPlayers+1] = 1;
		}
		else
		{
			isConnected[2*numPlayers][e+2*numPlayers] = 1;
		}

		var fx = fractionToTiles(0.5 + 0.16*cos(startAngle + e*TWO_PI/numPlayers));
		var fz = fractionToTiles(0.5 + 0.16*sin(startAngle + e*TWO_PI/numPlayers));
		var ix = round(fx);
		var iz = round(fz);
		IslandX[e+2*numPlayers]=ix;
		IslandZ[e+2*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.81);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		
		//Small Isles
		isConnected[e+3*numPlayers][e+numPlayers] = 1;
		var fx = fractionToTiles(0.5 + 0.41*cos(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
		var fz = fractionToTiles(0.5 + 0.41*sin(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
		var ix = round(fx);
		var iz = round(fz);
		IslandX[e+3*numPlayers]=ix;
		IslandZ[e+3*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.49);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		}
		
		for (var e = 0; e <numPlayers; e++)
		{
			isConnected[e][e+numPlayers] = 1;
			if (e+1<numPlayers)
			{
				isConnected[e + 1][e+numPlayers] = 1;
			}
			else
			{
				isConnected[0][e+numPlayers] = 1;
			}
	
			//second island id 4
			var fx = fractionToTiles(0.5 + 0.26*cos(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
			var fz = fractionToTiles(0.5 + 0.26*sin(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
			var ix = round(fx);
			var iz = round(fz);
			IslandX[e+numPlayers]=ix;
			IslandZ[e+numPlayers]=iz;
			// calculate size based on the radius
			var hillSize = PI * radius * radius;
			
			// create the hill
			var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
			var terrainPainter = new LayeredPainter(
				[tCliff, tHill],		// terrains
				[cliffRadius]		// widths
			);
			var elevationPainter = new SmoothElevationPainter(
				ELEVATION_SET,			// type
				elevation,				// elevation
				cliffRadius				// blend radius
			);
			createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		}
	}

			//More than 4 PLAYERS
		//-----------------
		//-----------------
		if (numPlayers > 4){
		numIslands = 2*numPlayers;
		var IslandX = new Array(numIslands);
		var IslandZ = new Array(numIslands);
		var isConnected = new Array(numIslands);
		for (var q=0; q <numIslands; q++)
		{
			isConnected[q]=new Array(numIslands);
		}
		for (var m = 0; m < numIslands; m++){
			for (var n = 0; n < numIslands; n++){
				isConnected[m][n] = 0;
			}
		}
		//connections
		var sX = 0;
		var sZ = 0;
		

		
		//centeral island id numPlayers
		
		for (var e = 0; e <numPlayers; e++)
		{
		if (e+1<numPlayers)
		{
			isConnected[e][e+1] = 1;
		}
		else
		{
			isConnected[0][e] = 1;
		}
		isConnected[e+numPlayers][e] = 1;
		if (e+numPlayers+1<numIslands)
		{
			isConnected[e+numPlayers][e+numPlayers+1] = 1;
		}
		else
		{
			isConnected[e+numPlayers][numPlayers] = 1;
		}
		var fx = fractionToTiles(0.5 + 0.16*cos(startAngle + e*TWO_PI/numPlayers));
		var fz = fractionToTiles(0.5 + 0.16*sin(startAngle + e*TWO_PI/numPlayers));
		var ix = round(fx);
		var iz = round(fz);
		IslandX[e+numPlayers]=ix;
		IslandZ[e+numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.81);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		}
		
	}
}

//****************************
//----------------------------
//Normal Size
//----------------------------
//****************************
if (mapSize == 320){
		//2,3,4,5 PLAYERS
		//-----------------
		//-----------------
		if ((numPlayers == 2)||(numPlayers == 3)||(numPlayers == 4)||(numPlayers == 5)){
		numIslands = 4*numPlayers+1;
		var IslandX = new Array(numIslands);
		var IslandZ = new Array(numIslands);
		var isConnected = new Array(numIslands);
		for (var q=0; q <numIslands; q++)
		{
			isConnected[q]=new Array(numIslands);
		}
		for (var m = 0; m < numIslands; m++){
			for (var n = 0; n < numIslands; n++){
				isConnected[m][n] = 0;
			}
		}
		//connections
		var sX = 0;
		var sZ = 0;
		for (var l = 0; l < numPlayers; l++)
		{
			isConnected[4*numPlayers][l+2*numPlayers] = 1;
			sX = sX + playerX[l];
			sZ = sZ + playerZ[l];
		}

		var fx = fractionToTiles(sX/numPlayers);
		var fz = fractionToTiles(sZ/numPlayers);
		var ix = round(fx);
		var iz = round(fz);
		IslandX[4*numPlayers]=ix;
		IslandZ[4*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.36);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		//centeral island id numPlayers
		
		for (var e = 0; e <numPlayers; e++)
		{
		isConnected[e+2*numPlayers][e] = 1;
		if (e+2*numPlayers+1<numIslands-numPlayers-1)
		{
			isConnected[e+2*numPlayers][e+2*numPlayers+1] = 1;
		}
		else
		{
			isConnected[2*numPlayers][e+2*numPlayers] = 1;
		}

		var fx = fractionToTiles(0.5 + 0.16*cos(startAngle + e*TWO_PI/numPlayers));
		var fz = fractionToTiles(0.5 + 0.16*sin(startAngle + e*TWO_PI/numPlayers));
		var ix = round(fx);
		var iz = round(fz);
		IslandX[e+2*numPlayers]=ix;
		IslandZ[e+2*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.81);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		
		//Small Isles
		isConnected[e+3*numPlayers][e+numPlayers] = 1;
		var fx = fractionToTiles(0.5 + 0.41*cos(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
		var fz = fractionToTiles(0.5 + 0.41*sin(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
		var ix = round(fx);
		var iz = round(fz);
		IslandX[e+3*numPlayers]=ix;
		IslandZ[e+3*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.49);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		}
		
		for (var e = 0; e <numPlayers; e++)
		{
			isConnected[e][e+numPlayers] = 1;
			if (e+1<numPlayers)
			{
				isConnected[e + 1][e+numPlayers] = 1;
			}
			else
			{
				isConnected[0][e+numPlayers] = 1;
			}
	
			//second island id 4
			var fx = fractionToTiles(0.5 + 0.26*cos(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
			var fz = fractionToTiles(0.5 + 0.26*sin(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
			var ix = round(fx);
			var iz = round(fz);
			IslandX[e+numPlayers]=ix;
			IslandZ[e+numPlayers]=iz;
			// calculate size based on the radius
			var hillSize = PI * radius * radius;
			
			// create the hill
			var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
			var terrainPainter = new LayeredPainter(
				[tCliff, tHill],		// terrains
				[cliffRadius]		// widths
			);
			var elevationPainter = new SmoothElevationPainter(
				ELEVATION_SET,			// type
				elevation,				// elevation
				cliffRadius				// blend radius
			);
			createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		}
	}

		//6,7 PLAYERS
		//-----------------
		//-----------------
		if ((numPlayers == 6)||(numPlayers == 7)){
		numIslands = 4*numPlayers+1;
		var IslandX = new Array(numIslands);
		var IslandZ = new Array(numIslands);
		var isConnected = new Array(numIslands);
		for (var q=0; q <numIslands; q++)
		{
			isConnected[q]=new Array(numIslands);
		}
		for (var m = 0; m < numIslands; m++){
			for (var n = 0; n < numIslands; n++){
				isConnected[m][n] = 0;
			}
		}
		//connections
		var sX = 0;
		var sZ = 0;
		for (var l = 0; l < numPlayers; l++)
		{
			isConnected[4*numPlayers][l+2*numPlayers] = 1;
			sX = sX + playerX[l];
			sZ = sZ + playerZ[l];
		}

		var fx = fractionToTiles(sX/numPlayers);
		var fz = fractionToTiles(sZ/numPlayers);
		var ix = round(fx);
		var iz = round(fz);
		IslandX[4*numPlayers]=ix;
		IslandZ[4*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.36);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		//centeral island id numPlayers
		
		for (var e = 0; e <numPlayers; e++)
		{
		isConnected[e+2*numPlayers][e] = 1;
		if (e+2*numPlayers+1<numIslands-numPlayers-1)
		{
			isConnected[e+2*numPlayers][e+2*numPlayers+1] = 1;
		}
		else
		{
			isConnected[2*numPlayers][e+2*numPlayers] = 1;
		}

		var fx = fractionToTiles(0.5 + 0.16*cos(startAngle + e*TWO_PI/numPlayers));
		var fz = fractionToTiles(0.5 + 0.16*sin(startAngle + e*TWO_PI/numPlayers));
		var ix = round(fx);
		var iz = round(fz);
		IslandX[e+2*numPlayers]=ix;
		IslandZ[e+2*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.81);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		
		//Small Isles
		isConnected[e+3*numPlayers][e+numPlayers] = 1;
		var fx = fractionToTiles(0.5 + 0.41*cos(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
		var fz = fractionToTiles(0.5 + 0.41*sin(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
		var ix = round(fx);
		var iz = round(fz);
		IslandX[e+3*numPlayers]=ix;
		IslandZ[e+3*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.49);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		}
		
		for (var e = 0; e <numPlayers; e++)
		{
			isConnected[e][e+numPlayers] = 1;
			if (e+1<numPlayers)
			{
				isConnected[e + 1][e+numPlayers] = 1;
			}
			else
			{
				isConnected[0][e+numPlayers] = 1;
			}
	
			//second island id 4
			var fx = fractionToTiles(0.5 + 0.26*cos(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
			var fz = fractionToTiles(0.5 + 0.26*sin(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
			var ix = round(fx);
			var iz = round(fz);
			IslandX[e+numPlayers]=ix;
			IslandZ[e+numPlayers]=iz;
			// calculate size based on the radius
			var hillSize = PI * radius * radius;
			
			// create the hill
			var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
			var terrainPainter = new LayeredPainter(
				[tCliff, tHill],		// terrains
				[cliffRadius]		// widths
			);
			var elevationPainter = new SmoothElevationPainter(
				ELEVATION_SET,			// type
				elevation,				// elevation
				cliffRadius				// blend radius
			);
			createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		}
	}
		//8 PLAYERS
		//-----------------
		//-----------------
		if (numPlayers == 8){
		numIslands = 2*numPlayers;
		var IslandX = new Array(numIslands);
		var IslandZ = new Array(numIslands);
		var isConnected = new Array(numIslands);
		for (var q=0; q <numIslands; q++)
		{
			isConnected[q]=new Array(numIslands);
		}
		for (var m = 0; m < numIslands; m++){
			for (var n = 0; n < numIslands; n++){
				isConnected[m][n] = 0;
			}
		}
		//connections
		var sX = 0;
		var sZ = 0;
		

		
		//centeral island id numPlayers
		
		for (var e = 0; e <numPlayers; e++)
		{
		if (e+1<numPlayers)
		{
			isConnected[e][e+1] = 1;
		}
		else
		{
			isConnected[0][e] = 1;
		}
		isConnected[e+numPlayers][e] = 1;
		if (e+numPlayers+1<numIslands)
		{
			isConnected[e+numPlayers][e+numPlayers+1] = 1;
		}
		else
		{
			isConnected[e+numPlayers][numPlayers] = 1;
		}
		var fx = fractionToTiles(0.5 + 0.16*cos(startAngle + e*TWO_PI/numPlayers));
		var fz = fractionToTiles(0.5 + 0.16*sin(startAngle + e*TWO_PI/numPlayers));
		var ix = round(fx);
		var iz = round(fz);
		IslandX[e+numPlayers]=ix;
		IslandZ[e+numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.81);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		}
		
	}
}

//****************************
//----------------------------
//Large and larger Sizes
//----------------------------
//****************************
if (mapSize > 383){
		//2,3,4,5 PLAYERS
		//-----------------
		//-----------------
		if ((numPlayers == 2)||(numPlayers == 3)||(numPlayers == 4)||(numPlayers == 5)){
		numIslands = 4*numPlayers+1;
		var IslandX = new Array(numIslands);
		var IslandZ = new Array(numIslands);
		var isConnected = new Array(numIslands);
		for (var q=0; q <numIslands; q++)
		{
			isConnected[q]=new Array(numIslands);
		}
		for (var m = 0; m < numIslands; m++){
			for (var n = 0; n < numIslands; n++){
				isConnected[m][n] = 0;
			}
		}
		//connections
		var sX = 0;
		var sZ = 0;
		for (var l = 0; l < numPlayers; l++)
		{
			isConnected[4*numPlayers][l+2*numPlayers] = 1;
			sX = sX + playerX[l];
			sZ = sZ + playerZ[l];
		}

		var fx = fractionToTiles(sX/numPlayers);
		var fz = fractionToTiles(sZ/numPlayers);
		var ix = round(fx);
		var iz = round(fz);
		IslandX[4*numPlayers]=ix;
		IslandZ[4*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.36);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		//centeral island id numPlayers
		
		for (var e = 0; e <numPlayers; e++)
		{
		isConnected[e+2*numPlayers][e] = 1;
		if (e+2*numPlayers+1<numIslands-numPlayers-1)
		{
			isConnected[e+2*numPlayers][e+2*numPlayers+1] = 1;
		}
		else
		{
			isConnected[2*numPlayers][e+2*numPlayers] = 1;
		}

		var fx = fractionToTiles(0.5 + 0.16*cos(startAngle + e*TWO_PI/numPlayers));
		var fz = fractionToTiles(0.5 + 0.16*sin(startAngle + e*TWO_PI/numPlayers));
		var ix = round(fx);
		var iz = round(fz);
		IslandX[e+2*numPlayers]=ix;
		IslandZ[e+2*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.81);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		
		//Small Isles
		isConnected[e+3*numPlayers][e+numPlayers] = 1;
		var fx = fractionToTiles(0.5 + 0.41*cos(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
		var fz = fractionToTiles(0.5 + 0.41*sin(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
		var ix = round(fx);
		var iz = round(fz);
		IslandX[e+3*numPlayers]=ix;
		IslandZ[e+3*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.49);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		}
		
		for (var e = 0; e <numPlayers; e++)
		{
			isConnected[e][e+numPlayers] = 1;
			if (e+1<numPlayers)
			{
				isConnected[e + 1][e+numPlayers] = 1;
			}
			else
			{
				isConnected[0][e+numPlayers] = 1;
			}
	
			//second island id 4
			var fx = fractionToTiles(0.5 + 0.24*cos(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
			var fz = fractionToTiles(0.5 + 0.24*sin(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
			var ix = round(fx);
			var iz = round(fz);
			IslandX[e+numPlayers]=ix;
			IslandZ[e+numPlayers]=iz;
			// calculate size based on the radius
			var hillSize = PI * radius * radius;
			
			// create the hill
			var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
			var terrainPainter = new LayeredPainter(
				[tCliff, tHill],		// terrains
				[cliffRadius]		// widths
			);
			var elevationPainter = new SmoothElevationPainter(
				ELEVATION_SET,			// type
				elevation,				// elevation
				cliffRadius				// blend radius
			);
			createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		}
		
	}

		//6,7,8 PLAYERS
		//-----------------
		//-----------------
		if ((numPlayers == 6)||(numPlayers == 7)||(numPlayers == 8)){
		numIslands = 4*numPlayers+1;
		var IslandX = new Array(numIslands);
		var IslandZ = new Array(numIslands);
		var isConnected = new Array(numIslands);
		for (var q=0; q <numIslands; q++)
		{
			isConnected[q]=new Array(numIslands);
		}
		for (var m = 0; m < numIslands; m++){
			for (var n = 0; n < numIslands; n++){
				isConnected[m][n] = 0;
			}
		}
		//connections
		var sX = 0;
		var sZ = 0;
		for (var l = 0; l < numPlayers; l++)
		{
			isConnected[4*numPlayers][l+2*numPlayers] = 1;
			sX = sX + playerX[l];
			sZ = sZ + playerZ[l];
		}

		var fx = fractionToTiles(sX/numPlayers);
		var fz = fractionToTiles(sZ/numPlayers);
		var ix = round(fx);
		var iz = round(fz);
		IslandX[4*numPlayers]=ix;
		IslandZ[4*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.36);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		

		
		//centeral island id numPlayers
		
		for (var e = 0; e <numPlayers; e++)
		{
		isConnected[e+2*numPlayers][e] = 1;
		if (e+2*numPlayers+1<numIslands-numPlayers-1)
		{
			isConnected[e+2*numPlayers][e+2*numPlayers+1] = 1;
		}
		else
		{
			isConnected[2*numPlayers][e+2*numPlayers] = 1;
		}

		var fx = fractionToTiles(0.5 + 0.16*cos(startAngle + e*TWO_PI/numPlayers));
		var fz = fractionToTiles(0.5 + 0.16*sin(startAngle + e*TWO_PI/numPlayers));
		var ix = round(fx);
		var iz = round(fz);
		IslandX[e+2*numPlayers]=ix;
		IslandZ[e+2*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.81);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		
		//Small Isles
		isConnected[e+3*numPlayers][e+numPlayers] = 1;
		var fx = fractionToTiles(0.5 + 0.41*cos(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
		var fz = fractionToTiles(0.5 + 0.41*sin(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
		var ix = round(fx);
		var iz = round(fz);
		IslandX[e+3*numPlayers]=ix;
		IslandZ[e+3*numPlayers]=iz;
		// calculate size based on the radius
		var hillSize = floor(PI * radius * radius * 0.36);
		
		// create the hill
		var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
		var terrainPainter = new LayeredPainter(
			[tCliff, tHill],		// terrains
			[cliffRadius]		// widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,			// type
			elevation,				// elevation
			cliffRadius				// blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		}
		
		for (var e = 0; e <numPlayers; e++)
		{
			isConnected[e][e+numPlayers] = 1;
			if (e+1<numPlayers)
			{
				isConnected[e + 1][e+numPlayers] = 1;
			}
			else
			{
				isConnected[0][e+numPlayers] = 1;
			}
	
			//second island id 4
			var fx = fractionToTiles(0.5 + 0.28*cos(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
			var fz = fractionToTiles(0.5 + 0.28*sin(startAngle + e*TWO_PI/numPlayers + TWO_PI/(2*numPlayers)));
			var ix = round(fx);
			var iz = round(fz);
			IslandX[e+numPlayers]=ix;
			IslandZ[e+numPlayers]=iz;
			// calculate size based on the radius
			var hillSize = PI * radius * radius * 0.81;
			
			// create the hill
			var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
			var terrainPainter = new LayeredPainter(
				[tCliff, tHill],		// terrains
				[cliffRadius]		// widths
			);
			var elevationPainter = new SmoothElevationPainter(
				ELEVATION_SET,			// type
				elevation,				// elevation
				cliffRadius				// blend radius
			);
			createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);
		}
		
	}
}

for (var m = 0; m < numIslands; m++){
	for (var n = 0; n < numIslands; n++){
		if(isConnected[m][n] == 1){
			isConnected[n][m] = 1;
		}
	}
}



for (var i = 0; i < numPlayers; i++)
{
	var id = playerIDs[i];
	log("Creating base for player " + id + "...");
	
	// some constants

	
	// get the x and z in tiles
	var fx = fractionToTiles(playerX[i]);
	var fz = fractionToTiles(playerZ[i]);
	var ix = round(fx);
	var iz = round(fz);
		IslandX[i]=ix;
		IslandZ[i]=iz;
	// calculate size based on the radius
	var hillSize = PI * radius * radius;
	
	// create the hill
	var placer = new ClumpPlacer(hillSize, 0.95, 0.6, 10, ix, iz);
	var terrainPainter = new LayeredPainter(
		[tCliff, tHill],		// terrains
		[cliffRadius]		// widths
	);
	var elevationPainter = new SmoothElevationPainter(
		ELEVATION_SET,			// type
		elevation,				// elevation
		cliffRadius				// blend radius
	);
	createArea(placer, [terrainPainter, elevationPainter, paintClass(clPlayer)], null);
	
	
	// create the city patch
	var cityRadius = radius/3;
	placer = new ClumpPlacer(PI*cityRadius*cityRadius, 0.6, 0.3, 10, ix, iz);
	var painter = new LayeredPainter([tRoadWild, tRoad], [1]);
	createArea(placer, painter, null);
	
	// create starting units
	placeCivDefaultEntities(fx, fz, id, BUILDING_ANGlE, {'iberWall' : 'towers'});
	
	// create animals
	for (var j = 0; j < 2; ++j)
	{
		var aAngle = randFloat(0, TWO_PI);
		var aDist = 7;
		var aX = round(fx + aDist * cos(aAngle));
		var aZ = round(fz + aDist * sin(aAngle));
		var group = new SimpleGroup(
			[new SimpleObject(oChicken, 5,5, 0,2)],
			true, clBaseResource, aX, aZ
		);
		createObjectGroup(group, 0);
	}
	
	// create berry bushes
	var bbAngle = randFloat(0, TWO_PI);
	var bbDist = 10;
	var bbX = round(fx + bbDist * cos(bbAngle));
	var bbZ = round(fz + bbDist * sin(bbAngle));
	group = new SimpleGroup(
		[new SimpleObject(oBerryBush, 5,5, 0,3)],
		true, clBaseResource, bbX, bbZ
	);
	createObjectGroup(group, 0);
	
	// create metal mine
	var mAngle = bbAngle;
	while(abs(mAngle - bbAngle) < PI/3)
	{
		mAngle = randFloat(0, TWO_PI);
	}
	var mDist = radius - 4;
	var mX = round(fx + mDist * cos(mAngle));
	var mZ = round(fz + mDist * sin(mAngle));
	group = new SimpleGroup(
		[new SimpleObject(oMetalLarge, 1,1, 0,0)],
		true, clBaseResource, mX, mZ
	);
	createObjectGroup(group, 0);
	
	// create stone mines
	mAngle += randFloat(PI/8, PI/4);
	mX = round(fx + mDist * cos(mAngle));
	mZ = round(fz + mDist * sin(mAngle));
	group = new SimpleGroup(
		[new SimpleObject(oStoneLarge, 1,1, 0,2)],
		true, clBaseResource, mX, mZ
	);
	createObjectGroup(group, 0);
	
	// create starting trees
	var num = floor(hillSize / 60);
	var tAngle = randFloat(-PI/3, 4*PI/3);
	var tDist = 11;
	var tX = round(fx + tDist * cos(tAngle));
	var tZ = round(fz + tDist * sin(tAngle));
	group = new SimpleGroup(
		[new SimpleObject(oOak, num, num, 0,4)],
		false, clBaseResource, tX, tZ
	);
	createObjectGroup(group, 0, [avoidClasses(clBaseResource,2), stayClasses(clPlayer, 3)]);
	
	// create grass tufts
	var num = hillSize / 250;
	for (var j = 0; j < num; j++)
	{
		var gAngle = randFloat(0, TWO_PI);
		var gDist = radius - (5 + randInt(7));
		var gX = round(fx + gDist * cos(gAngle));
		var gZ = round(fz + gDist * sin(gAngle));
		group = new SimpleGroup(
			[new SimpleObject(aGrassShort, 2,5, 0,1, -PI/8,PI/8)],
			false, clBaseResource, gX, gZ
		);
		createObjectGroup(group, 0);
	}
}

RMS.SetProgress(30);

//Create connectors
for (var ix = 0; ix < mapSize; ix++)
{
	for (var iz = 0; iz < mapSize; iz++)
	{
		for (var m = 0; m < numIslands; m++)
		{
			for (var n = 0; n < numIslands; n++)
			{
				if(isConnected[m][n] == 1)
				{
					var a = IslandZ[m]-IslandZ[n];
					var b = IslandX[n]-IslandX[m];
					var c = (IslandZ[m]*(IslandX[m]-IslandX[n]))-(IslandX[m]*(IslandZ[m]-IslandZ[n]));
					var dis = abs(a*ix + b*iz + c)/sqrt(a*a + b*b);
					var k = (a*ix + b*iz + c)/(a*a + b*b);
					var y = iz-(b*k);
					if((dis < 5)&&(y <= Math.max(IslandZ[m],IslandZ[n]))&&(y >= Math.min(IslandZ[m],IslandZ[n])))
					{
						if (dis < 3){
							var h = 20;
							if (dis < 2)
							{
								var t = tHill;
							}
							else
							{
								var t = tCliff;
							}
							addToClass(ix, iz, clLand);
						}
						else
						{
							var h = 50 - 10 * dis;
							var t = tCliff;
							addToClass(ix, iz, clLand);
						}
						if (getHeight(ix, iz)<h)
						{
							placeTerrain(ix, iz, t);
							setHeight(ix, iz, h);
						}
					}
				}
			}
		}
	}
}


// calculate desired number of trees for map (based on size)
if (rt == 6)
{
var MIN_TREES = 200;
var MAX_TREES = 1250;
var P_FOREST = 0.02;
}
else if (rt == 7)
{
var MIN_TREES = 1000;
var MAX_TREES = 6000;
var P_FOREST = 0.6;
}
else
{
var MIN_TREES = 500;
var MAX_TREES = 3000;
var P_FOREST = 0.7;
}
var totalTrees = scaleByMapSize(MIN_TREES, MAX_TREES);
var numForest = totalTrees * P_FOREST;
var numStragglers = totalTrees * (1.0 - P_FOREST);

// create forests
log("Creating forests...");
var types = [
	[[tGrassDForest, tGrass, pForestD], [tGrassDForest, pForestD]],
	[[tGrassPForest, tGrass, pForestP], [tGrassPForest, pForestP]]
];	// some variation

if (rt == 6)
{
var size = numForest / (0.5 * scaleByMapSize(2,8) * numPlayers);
}
else
{
var size = numForest / (scaleByMapSize(2,8) * numPlayers);
}
var num = floor(size / types.length);
for (var i = 0; i < types.length; ++i)
{
	placer = new ClumpPlacer(numForest / num, 0.1, 0.1, 1);
	painter = new LayeredPainter(
		types[i],		// terrains
		[2]											// widths
		);
	createAreas(
		placer,
		[painter, paintClass(clForest)], 
		[avoidClasses(clPlayer, 6, clForest, 10, clHill, 0), stayClasses(clLand, 3)],
		num
	);
}

RMS.SetProgress(55);


log("Creating stone mines...");
// create large stone quarries
group = new SimpleGroup([new SimpleObject(oStoneSmall, 0,2, 0,4), new SimpleObject(oStoneLarge, 1,1, 0,4)], true, clRock);
createObjectGroups(group, 0,
	[avoidClasses(clForest, 1, clPlayer, 10, clRock, 10, clHill, 1), stayClasses(clLand, 5)],
	5*scaleByMapSize(4,16), 100
);

// create small stone quarries
group = new SimpleGroup([new SimpleObject(oStoneSmall, 2,5, 1,3)], true, clRock);
createObjectGroups(group, 0,
	[avoidClasses(clForest, 1, clPlayer, 10, clRock, 10, clHill, 1), stayClasses(clLand, 5)],
	5*scaleByMapSize(4,16), 100
);

log("Creating metal mines...");
// create large metal quarries
group = new SimpleGroup([new SimpleObject(oMetalLarge, 1,1, 0,4)], true, clMetal);
createObjectGroups(group, 0,
	[avoidClasses(clForest, 1, clPlayer, 10, clMetal, 10, clRock, 5, clHill, 1), stayClasses(clLand, 5)],
	5*scaleByMapSize(4,16), 100
);

RMS.SetProgress(65);
// create dirt patches
log("Creating dirt patches...");
var sizes = [scaleByMapSize(3, 48), scaleByMapSize(5, 84), scaleByMapSize(8, 128)];
for (var i = 0; i < sizes.length; i++)
{
	placer = new ClumpPlacer(sizes[i], 0.3, 0.06, 0.5);
	painter = new LayeredPainter(
		[[tGrass,tGrassA],[tGrassA,tGrassB], [tGrassB,tGrassC]], 		// terrains
		[1,1]															// widths
	);
	createAreas(
		placer,
		[painter, paintClass(clDirt)],
		[avoidClasses(clForest, 0, clHill, 0, clDirt, 5, clPlayer, 12), stayClasses(clLand, 5)],
		scaleByMapSize(15, 45)
	);
}

// create grass patches
log("Creating grass patches...");
var sizes = [scaleByMapSize(2, 32), scaleByMapSize(3, 48), scaleByMapSize(5, 80)];
for (var i = 0; i < sizes.length; i++)
{
	placer = new ClumpPlacer(sizes[i], 0.3, 0.06, 0.5);
	painter = new TerrainPainter(tGrassPatch);
	createAreas(
		placer,
		painter,
		[avoidClasses(clForest, 0, clHill, 0, clDirt, 5, clPlayer, 12), stayClasses(clLand, 5)],
		scaleByMapSize(15, 45)
	);
}

// create small decorative rocks
log("Creating small decorative rocks...");
group = new SimpleGroup(
	[new SimpleObject(aRockMedium, 1,3, 0,1)],
	true
);
createObjectGroups(
	group, 0,
	[avoidClasses(clWater, 0, clForest, 0, clPlayer, 0, clHill, 0), stayClasses(clLand, 1)],
	scaleByMapSize(16, 262), 50
);


// create large decorative rocks
log("Creating large decorative rocks...");
group = new SimpleGroup(
	[new SimpleObject(aRockLarge, 1,2, 0,1), new SimpleObject(aRockMedium, 1,3, 0,2)],
	true
);
createObjectGroups(
	group, 0,
	[avoidClasses(clWater, 0, clForest, 0, clPlayer, 0, clHill, 0), stayClasses(clLand, 1)],
	scaleByMapSize(8, 131), 50
);

RMS.SetProgress(70);

// create deer
log("Creating deer...");
group = new SimpleGroup(
	[new SimpleObject(oDeer, 5,7, 0,4)],
	true, clFood
);
createObjectGroups(group, 0,
	[avoidClasses(clWater, 0, clForest, 0, clPlayer, 10, clHill, 1, clFood, 20), stayClasses(clLand, 4)],
	3 * numPlayers, 50
);

RMS.SetProgress(75);

// create sheep
log("Creating sheep...");
group = new SimpleGroup(
	[new SimpleObject(oSheep, 2,3, 0,2)],
	true, clFood
);
createObjectGroups(group, 0,
	[avoidClasses(clWater, 0, clForest, 0, clPlayer, 10, clHill, 1, clFood, 20), stayClasses(clLand, 4)],
	3 * numPlayers, 50
);


RMS.SetProgress(85);


// create straggler trees
log("Creating straggler trees...");
var types = [oOak, oOakLarge, oPine, oApple];	// some variation
var num = floor(numStragglers / types.length);
for (var i = 0; i < types.length; ++i)
{
	group = new SimpleGroup(
		[new SimpleObject(types[i], 1,1, 0,3)],
		true, clForest
	);
	createObjectGroups(group, 0,
		[avoidClasses(clWater, 1, clForest, 1, clHill, 1, clPlayer, 9, clMetal, 1, clRock, 1), stayClasses(clLand, 4)],
		num
	);
}

var planetm = 1;
if (rt==7)
{
	planetm = 8;
}
//create small grass tufts
log("Creating small grass tufts...");
group = new SimpleGroup(
	[new SimpleObject(aGrassShort, 1,2, 0,1, -PI/8,PI/8)]
);
createObjectGroups(group, 0,
	[avoidClasses(clWater, 2, clHill, 2, clPlayer, 2, clDirt, 0), stayClasses(clLand, 2)],
	planetm * scaleByMapSize(13, 200)
);

RMS.SetProgress(90);

// create large grass tufts
log("Creating large grass tufts...");
group = new SimpleGroup(
	[new SimpleObject(aGrass, 2,4, 0,1.8, -PI/8,PI/8), new SimpleObject(aGrassShort, 3,6, 1.2,2.5, -PI/8,PI/8)]
);
createObjectGroups(group, 0,
	[avoidClasses(clWater, 3, clHill, 2, clPlayer, 2, clDirt, 1, clForest, 0), stayClasses(clLand, 2)],
	planetm * scaleByMapSize(13, 200)
);

RMS.SetProgress(95);

// create bushes
log("Creating bushes...");
group = new SimpleGroup(
	[new SimpleObject(aBushMedium, 1,2, 0,2), new SimpleObject(aBushSmall, 2,4, 0,2)]
);
createObjectGroups(group, 0,
	[avoidClasses(clWater, 1, clHill, 1, clPlayer, 1, clDirt, 1), stayClasses(clLand, 2)],
	planetm * scaleByMapSize(13, 200), 50
);

rt = randInt(1,3)
if (rt==1){
setSkySet("cirrus");
}
else if (rt ==2){
setSkySet("cumulus");
}
else if (rt ==3){
setSkySet("sunny");
}
setSunRotation(randFloat(0, TWO_PI));
setSunElevation(randFloat(PI/ 5, PI / 3));

// Export map data
ExportMap();
