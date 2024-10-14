import * as React from "react";
import { makeStyles, Spinner } from "@fluentui/react-components";
import Header from "./Header";
import ChatInterface from "./ChatInterface";
import SettingsPanel from "./SettingsPanel";
import SplashScreen from "./SplashScreen";
import { useState, useEffect } from "react";

interface AppProps {
  title: string;
}

// Charts

export enum ChartType {
  _3DArea = "3DArea",
  _3DAreaStacked = "3DAreaStacked",
  _3DAreaStacked100 = "3DAreaStacked100",
  _3DBarClustered = "3DBarClustered",
  _3DBarStacked = "3DBarStacked",
  _3DBarStacked100 = "3DBarStacked100",
  _3DColumn = "3DColumn",
  _3DColumnClustered = "3DColumnClustered",
  _3DColumnStacked = "3DColumnStacked",
  _3DColumnStacked100 = "3DColumnStacked100",
  _3DLine = "3DLine",
  _3DPie = "3DPie",
  _3DPieExploded = "3DPieExploded",
  area = "Area",
  areaStacked = "AreaStacked",
  areaStacked100 = "AreaStacked100",
  barClustered = "BarClustered",
  barOfPie = "BarOfPie",
  barStacked = "BarStacked",
  barStacked100 = "BarStacked100",
  boxwhisker = "Boxwhisker",
  bubble = "Bubble",
  bubble3DEffect = "Bubble3DEffect",
  columnClustered = "ColumnClustered",
  columnStacked = "ColumnStacked",
  columnStacked100 = "ColumnStacked100",
  coneBarClustered = "ConeBarClustered",
  coneBarStacked = "ConeBarStacked",
  coneBarStacked100 = "ConeBarStacked100",
  coneCol = "ConeCol",
  coneColClustered = "ConeColClustered",
  coneColStacked = "ConeColStacked",
  coneColStacked100 = "ConeColStacked100",
  cylinderBarClustered = "CylinderBarClustered",
  cylinderBarStacked = "CylinderBarStacked",
  cylinderBarStacked100 = "CylinderBarStacked100",
  cylinderCol = "CylinderCol",
  cylinderColClustered = "CylinderColClustered",
  cylinderColStacked = "CylinderColStacked",
  cylinderColStacked100 = "CylinderColStacked100",
  doughnut = "Doughnut",
  doughnutExploded = "DoughnutExploded",
  funnel = "Funnel",
  histogram = "Histogram",
  invalid = "Invalid",
  line = "Line",
  lineMarkers = "LineMarkers",
  lineMarkersStacked = "LineMarkersStacked",
  lineMarkersStacked100 = "LineMarkersStacked100",
  lineStacked = "LineStacked",
  lineStacked100 = "LineStacked100",
  pareto = "Pareto",
  pie = "Pie",
  pieExploded = "PieExploded",
  pieOfPie = "PieOfPie",
  pyramidBarClustered = "PyramidBarClustered",
  pyramidBarStacked = "PyramidBarStacked",
  pyramidBarStacked100 = "PyramidBarStacked100",
  pyramidCol = "PyramidCol",
  pyramidColClustered = "PyramidColClustered",
  pyramidColStacked = "PyramidColStacked",
  pyramidColStacked100 = "PyramidColStacked100",
  radar = "Radar",
  radarFilled = "RadarFilled",
  radarMarkers = "RadarMarkers",
  regionMap = "RegionMap",
  stockHLC = "StockHLC",
  stockOHLC = "StockOHLC",
  stockVHLC = "StockVHLC",
  stockVOHLC = "StockVOHLC",
  sunburst = "Sunburst",
  surface = "Surface",
  surfaceTopView = "SurfaceTopView",
  surfaceTopViewWireframe = "SurfaceTopViewWireframe",
  surfaceWireframe = "SurfaceWireframe",
  treemap = "Treemap",
  waterfall = "Waterfall",
  xyscatter = "XYScatter",
  xyscatterLines = "XYScatterLines",
  xyscatterLinesNoMarkers = "XYScatterLinesNoMarkers",
  xyscatterSmooth = "XYScatterSmooth",
  xyscatterSmoothNoMarkers = "XYScatterSmoothNoMarkers",
}

export enum ChartAxisCategoryType {
  Automatic = "Automatic", // Excel controls the axis type.
  DateAxis = "DateAxis", // Axis groups data on a time scale.
  TextAxis = "TextAxis", // Axis groups data by an arbitrary set of categories.
}

export enum ChartColorScheme {
  ColorfulPalette1 = "ColorfulPalette1",
  ColorfulPalette2 = "ColorfulPalette2",
  ColorfulPalette3 = "ColorfulPalette3",
  ColorfulPalette4 = "ColorfulPalette4",
  MonochromaticPalette1 = "MonochromaticPalette1",
  MonochromaticPalette2 = "MonochromaticPalette2",
  MonochromaticPalette3 = "MonochromaticPalette3",
  MonochromaticPalette4 = "MonochromaticPalette4",
  MonochromaticPalette5 = "MonochromaticPalette5",
  MonochromaticPalette6 = "MonochromaticPalette6",
  MonochromaticPalette7 = "MonochromaticPalette7",
  MonochromaticPalette8 = "MonochromaticPalette8",
  MonochromaticPalette9 = "MonochromaticPalette9",
  MonochromaticPalette10 = "MonochromaticPalette10",
  MonochromaticPalette11 = "MonochromaticPalette11",
  MonochromaticPalette12 = "MonochromaticPalette12",
  MonochromaticPalette13 = "MonochromaticPalette13",
}

export enum ChartDataLabelPosition {
  BestFit = "BestFit",
  Bottom = "Bottom",
  Callout = "Callout",
  Center = "Center",
  InsideBase = "InsideBase",
  InsideEnd = "InsideEnd",
  Invalid = "Invalid",
  Left = "Left",
  None = "None",
  OutsideEnd = "OutsideEnd",
  Right = "Right",
  Top = "Top",
}

export enum ChartDataSourceType {
  ExternalRange = "ExternalRange", // The data source type of the chart series is an external range.
  List = "List", // The data source type of the chart series is a list.
  LocalRange = "LocalRange", // The data source type of the chart series is a local range.
}

export enum ChartGradientStyle {
  ThreePhaseColor = "ThreePhaseColor",
  TwoPhaseColor = "TwoPhaseColor",
}

export enum ChartGradientStyleType {
  ExtremeValue = "ExtremeValue",
  Number = "Number",
  Percent = "Percent",
}

export enum ChartLegendPosition {
  Bottom = "Bottom",
  Corner = "Corner",
  Custom = "Custom",
  Invalid = "Invalid",
  Left = "Left",
  Right = "Right",
  Top = "Top",
}

export enum ChartLineStyle {
  Automatic = "Automatic",
  Continuous = "Continuous",
  Dash = "Dash",
  DashDot = "DashDot",
  DashDotDot = "DashDotDot",
  Dot = "Dot",
  Grey25 = "Grey25",
  Grey50 = "Grey50",
  Grey75 = "Grey75",
  None = "None",
  RoundDot = "RoundDot",
}

export enum ChartMapAreaLevel {
  Automatic = "Automatic",
  City = "City",
  Continent = "Continent",
  Country = "Country",
  County = "County",
  DataOnly = "DataOnly",
  State = "State",
  World = "World",
}

export enum ChartMapLabelStrategy {
  BestFit = "BestFit",
  None = "None",
  ShowAll = "ShowAll",
}

export enum ChartMapProjectionType {
  Albers = "Albers",
  Automatic = "Automatic",
  Mercator = "Mercator",
  Miller = "Miller",
  Robinson = "Robinson",
}

export enum ChartMarkerStyle {
  Automatic = "Automatic",
  Circle = "Circle",
  Dash = "Dash",
  Diamond = "Diamond",
  Dot = "Dot",
  Invalid = "Invalid",
  None = "None",
  Picture = "Picture",
  Plus = "Plus",
  Square = "Square",
  Star = "Star",
  Triangle = "Triangle",
  X = "X",
}

export enum ChartParentLabelStrategy {
  Banner = "Banner",
  None = "None",
  Overlapping = "Overlapping",
}

export enum ChartPlotAreaPosition {
  Automatic = "Automatic",
  Custom = "Custom",
}

export enum ChartPlotBy {
  Columns = "Columns",
  Rows = "Rows",
}

export enum ChartSeriesDimension {
  BubbleSizes = "BubbleSizes", // The chart series axis for the bubble sizes in bubble charts.
  Categories = "Categories", // The chart series axis for the categories.
  Values = "Values", // The chart series axis for the values.
  XValues = "XValues", // The chart series axis for the x-axis values in scatter and bubble charts.
  YValues = "YValues", // The chart series axis for the y-axis values in scatter and bubble charts.
}

export enum ChartSplitType {
  SplitByCustomSplit = "SplitByCustomSplit",
  SplitByPercentValue = "SplitByPercentValue",
  SplitByPosition = "SplitByPosition",
  SplitByValue = "SplitByValue",
}

export enum ChartTextHorizontalAlignment {
  Center = "Center",
  Distributed = "Distributed",
  Justify = "Justify",
  Left = "Left",
  Right = "Right",
}

export enum ChartTextVerticalAlignment {
  Bottom = "Bottom",
  Center = "Center",
  Distributed = "Distributed",
  Justify = "Justify",
  Top = "Top",
}

export enum ChartTickLabelAlignment {
  Center = "Center",
  Left = "Left",
  Right = "Right",
}

export enum ChartTitlePosition {
  Automatic = "Automatic",
  Bottom = "Bottom",
  Left = "Left",
  Right = "Right",
  Top = "Top",
}

export enum ChartTrendlineType {
  Exponential = "Exponential",
  Linear = "Linear",
  Logarithmic = "Logarithmic",
  MovingAverage = "MovingAverage",
  Polynomial = "Polynomial",
  Power = "Power",
}

export enum ChartUnderlineStyle {
  None = "None",
  Single = "Single",
}

// Formatting

export enum FormatOptions {
  DiagonalDown = "DiagonalDown",
  DiagonalUp = "DiagonalUp",
  EdgeBottom = "EdgeBottom",
  EdgeLeft = "EdgeLeft",
  EdgeRight = "EdgeRight",
  EdgeTop = "EdgeTop",
  InsideHorizontal = "InsideHorizontal",
  InsideVertical = "InsideVertical",
  Continuous = "Continuous",
  Dash = "Dash",
  DashDot = "DashDot",
  DashDotDot = "DashDotDot",
  Dot = "Dot",
  Double = "Double",
  None = "None",
  SlantDashDot = "SlantDashDot",
  Hairline = "Hairline",
  Medium = "Medium",
  Thick = "Thick",
  Thin = "Thin",
  Array = "Array", // Represents an ArrayCellValue.
  Boolean = "Boolean", // Represents a BooleanCellValue.
  Empty = "Empty", // Represents an EmptyCellValue.
  Entity = "Entity", // Represents an EntityCellValue.
  Error = "Error", // Represents an ErrorCellValue.
  ExternalCodeServiceObject = "ExternalCodeServiceObject", // Represents an ExternalCodeServiceObjectCellValue.
  FormattedNumber = "FormattedNumber", // Represents a FormattedNumberCellValue.
  LinkedEntity = "LinkedEntity", // Represents a LinkedEntityCellValue.
  LocalImage = "LocalImage", // Represents a LocalImageCellValue.
  NotAvailable = "NotAvailable", // Represents a ValueTypeNotAvailableCellValue.
  Reference = "Reference", // Represents a ReferenceCellValue.
  String = "String", // Represents a StringCellValue.
  WebImage = "WebImage", // Represents a WebImageCellValue.
  Checker = "Checker",
  CrissCross = "CrissCross",
  Down = "Down",
  Gray16 = "Gray16",
  Gray25 = "Gray25",
  Gray50 = "Gray50",
  Gray75 = "Gray75",
  Gray8 = "Gray8",
  Grid = "Grid",
  Horizontal = "Horizontal",
  LightDown = "LightDown",
  LightHorizontal = "LightHorizontal",
  LightUp = "LightUp",
  LightVertical = "LightVertical",
  LinearGradient = "LinearGradient",
  RectangularGradient = "RectangularGradient",
  SemiGray75 = "SemiGray75",
  Solid = "Solid",
  Up = "Up",
  Vertical = "Vertical",
  Accounting = "Accounting", // Accounting formats line up the currency symbols and decimal points in a column.
  Currency = "Currency", // Currency formats are used for general monetary values.
  Custom = "Custom", // A custom format that is not a part of any category.
  Date = "Date", // Date formats display date and time serial numbers as date values.
  Fraction = "Fraction", // Fraction formats display the cell value as a whole number with the remainder rounded to the nearest fraction value.
  General = "General", // General format cells have no specific number format.
  Number = "Number", // Number is used for general display of numbers.
  Percentage = "Percentage", // Percentage formats multiply the cell value by 100 and displays the result with a percent symbol.
  Scientific = "Scientific", // Scientific formats display the cell value as a number between 1 and 10 multiplied by a power of 10.
  Special = "Special", // Special formats are useful for tracking list and database values.
  TextFormat = "Text", // Text format cells are treated as text even when a number is in the cell.
  Time = "Time", // Time formats display date and time serial numbers as date values.
  Blanks = "Blanks", // Cells with no content.
  ConditionalFormats = "ConditionalFormats", // All cells with conditional formats.
  Constants = "Constants", // Cells containing constants.
  DataValidations = "DataValidations", // Cells with validation criteria.
  Formulas = "Formulas", // Cells containing formulas.
  SameConditionalFormat = "SameConditionalFormat", // Cells with the same conditional format as the first cell in the range.
  SameDataValidation = "SameDataValidation", // Cells with the same data validation criteria as the first cell in the range.
  Visible = "Visible", // Cells that are visible.
  AllCells = "All", // Cells that have errors, boolean, numeric, or string values.
  Errors = "Errors", // Cells that have errors.
  ErrorsLogical = "ErrorsLogical", // Cells that have errors or boolean values.
  ErrorsLogicalNumber = "ErrorsLogicalNumber", // Cells that have errors, boolean, or numeric values.
  ErrorsLogicalText = "ErrorsLogicalText", // Cells that have errors, boolean, or string values.
  ErrorsNumbers = "ErrorsNumbers", // Cells that have errors or numeric values.
  ErrorsNumberText = "ErrorsNumberText", // Cells that have errors, numeric, or string values.
  ErrorsText = "ErrorsText", // Cells that have errors or string values.
  Logical = "Logical", // Cells that have a boolean value.
  LogicalNumbers = "LogicalNumbers", // Cells that have a boolean or numeric value.
  LogicalNumbersText = "LogicalNumbersText", // Cells that have a boolean, numeric, or string value.
  LogicalText = "LogicalText", // Cells that have a boolean or string value.
  Numbers = "Numbers", // Cells that have a numeric value.
  NumbersText = "NumbersText", // Cells that have a numeric or string value.
  TextCells = "TextCells", // Cells that have a string value.
  All = "All", // Clears all contents and formatting.
  Contents = "Contents", // Clears the contents of the range.
  Formats = "Formats", // Clears all formatting for the range.
  Hyperlinks = "Hyperlinks", // Clears all hyperlinks but leaves content and formatting intact.
  RemoveHyperlinks = "RemoveHyperlinks", // Removes hyperlinks and formatting but leaves content, conditional formats, and data validation intact.
}

export enum ConditionalCellValueOperator {
  Between = "Between",
  EqualTo = "EqualTo",
  GreaterThan = "GreaterThan",
  GreaterThanOrEqual = "GreaterThanOrEqual",
  Invalid = "Invalid",
  LessThan = "LessThan",
  LessThanOrEqual = "LessThanOrEqual",
  NotBetween = "NotBetween",
  NotEqualTo = "NotEqualTo",
}

export enum ConditionalDataBarDirection {
  Automatic = "Automatic",
  CellMidPoint = "CellMidPoint",
  None = "None",
}

export enum ConditionalDataBarAxisPosition {
  Context = "Context",
  LeftToRight = "LeftToRight",
  RightToLeft = "RightToLeft",
}

export enum ConditionalFormatColorCriterionType {
  Formula = "Formula",
  HighestValue = "HighestValue",
  LowestValue = "LowestValue",
  Number = "Number",
  Percent = "Percent",
  Percentile = "Percentile",
}

export enum ConditionalFormatDirection {
  Bottom = "Bottom",
  Top = "Top",
}

export enum ConditionalFormatIconRuleType {
  Formula = "Formula",
  Invalid = "Invalid",
  Number = "Number",
  Percent = "Percent",
  Percentile = "Percentile",
}

export enum ConditionalFormatPresetCriterionType {
  AboveAverage = "AboveAverage",
  BelowAverage = "BelowAverage",
  Blanks = "Blanks",
  DuplicateValues = "DuplicateValues",
  EqualOrAboveAverage = "EqualOrAboveAverage",
  EqualOrBelowAverage = "EqualOrBelowAverage",
  Invalid = "Invalid",
  LastMonth = "LastMonth",
  LastSevenDays = "LastSevenDays",
  LastWeek = "LastWeek",
  NextMonth = "NextMonth",
  NextWeek = "NextWeek",
  NonBlanks = "NonBlanks",
  NonErrors = "NonErrors",
  OneStdDevAboveAverage = "OneStdDevAboveAverage",
  OneStdDevBelowAverage = "OneStdDevBelowAverage",
  ThisMonth = "ThisMonth",
  ThisWeek = "ThisWeek",
  ThreeStdDevAboveAverage = "ThreeStdDevAboveAverage",
  ThreeStdDevBelowAverage = "ThreeStdDevBelowAverage",
  Today = "Today",
  Tomorrow = "Tomorrow",
  TwoStdDevAboveAverage = "TwoStdDevAboveAverage",
  TwoStdDevBelowAverage = "TwoStdDevBelowAverage",
  UniqueValues = "UniqueValues",
  Yesterday = "Yesterday",
}

export enum ConditionalFormatPresetCriterion {
  AboveAverage = "AboveAverage",
  BelowAverage = "BelowAverage",
  Blanks = "Blanks",
  DuplicateValues = "DuplicateValues",
  EqualOrAboveAverage = "EqualOrAboveAverage",
  EqualOrBelowAverage = "EqualOrBelowAverage",
  Errors = "Errors",
  LastMonth = "LastMonth",
  LastSevenDays = "LastSevenDays",
  LastWeek = "LastWeek",
  NextMonth = "NextMonth",
  NextWeek = "NextWeek",
  NonBlanks = "NonBlanks",
  NonErrors = "NonErrors",
  OneStdDevAboveAverage = "OneStdDevAboveAverage",
  OneStdDevBelowAverage = "OneStdDevBelowAverage",
  ThisMonth = "ThisMonth",
  ThisWeek = "ThisWeek",
  ThreeStdDevAboveAverage = "ThreeStdDevAboveAverage",
  ThreeStdDevBelowAverage = "ThreeStdDevBelowAverage",
  Today = "Today",
  Tomorrow = "Tomorrow",
  TwoStdDevAboveAverage = "TwoStdDevAboveAverage",
  TwoStdDevBelowAverage = "TwoStdDevBelowAverage",
  UniqueValues = "UniqueValues",
  Yesterday = "Yesterday",
}

export enum ConditionalFormatType {
  CellValue = "CellValue",
  ColorScale = "ColorScale",
  ContainsText = "ContainsText",
  Custom = "Custom",
  DataBar = "DataBar",
  IconSet = "IconSet",
  PresetCriteria = "PresetCriteria",
  TopBottom = "TopBottom",
}

export enum ConditionalRangeBorderIndex {
  EdgeBottom = "EdgeBottom",
  EdgeLeft = "EdgeLeft",
  EdgeRight = "EdgeRight",
  EdgeTop = "EdgeTop",
}

export enum ConditionalRangeBorderLineStyle {
  Continuous = "Continuous",
  Dash = "Dash",
  DashDot = "DashDot",
  DashDotDot = "DashDotDot",
  Dot = "Dot",
}

export enum ConditionalRangeFontUnderlineStyle {
  Double = "Double",
  Single = "Single",
}

export enum ConditionalTextOperator {
  BeginsWith = "BeginsWith",
  Contains = "Contains",
  EndsWith = "EndsWith",
  NotContains = "NotContains",
}

export enum ConditionalTopBottomCriterionType {
  BottomItems = "BottomItems",
  BottomPercent = "BottomPercent",
  TopItems = "TopItems",
  TopPercent = "TopPercent",
}

// Alignment

export enum HorizontalAlignment {
  Center = "Center",
  CenterAcrossSelection = "CenterAcrossSelection",
  Distributed = "Distributed",
  Fill = "Fill",
  General = "General",
  Justify = "Justify",
  Left = "Left",
  Right = "Right",
}

export enum VerticalAlignment {
  Bottom = "Bottom",
  Center = "Center",
  Distributed = "Distributed",
  Justify = "Justify",
  Top = "Top",
}

// Filters

export enum Filters {
  After = "After", // Date is after comparator date. Required Criteria: {comparator}. Optional Criteria: {wholeDays}.
  AfterOrEqualTo = "AfterOrEqualTo", // Date is after or equal to comparator date. Required Criteria: {comparator}. Optional Criteria: {wholeDays}.
  AllDatesInPeriodApril = "AllDatesInPeriodApril", // Date is in April.
  AllDatesInPeriodAugust = "AllDatesInPeriodAugust", // Date is in August.
  AllDatesInPeriodDecember = "AllDatesInPeriodDecember", // Date is in December.
  AllDatesInPeriodFebruary = "AllDatesInPeriodFebruary", // Date is in February.
  AllDatesInPeriodJanuary = "AllDatesInPeriodJanuary", // Date is in January.
  AllDatesInPeriodJuly = "AllDatesInPeriodJuly", // Date is in July.
  AllDatesInPeriodJune = "AllDatesInPeriodJune", // Date is in June.
  AllDatesInPeriodMarch = "AllDatesInPeriodMarch", // Date is in March.
  AllDatesInPeriodMay = "AllDatesInPeriodMay", // Date is in May.
  AllDatesInPeriodNovember = "AllDatesInPeriodNovember", // Date is in November.
  AllDatesInPeriodOctober = "AllDatesInPeriodOctober", // Date is in October.
  AllDatesInPeriodQuarter1 = "AllDatesInPeriodQuarter1", // Date is in Quarter 1.
  AllDatesInPeriodQuarter2 = "AllDatesInPeriodQuarter2", // Date is in Quarter 2.
  AllDatesInPeriodQuarter3 = "AllDatesInPeriodQuarter3", // Date is in Quarter 3.
  AllDatesInPeriodQuarter4 = "AllDatesInPeriodQuarter4", // Date is in Quarter 4.
  AllDatesInPeriodSeptember = "AllDatesInPeriodSeptember", // Date is in September.
  Before = "Before", // Date is before comparator date. Required Criteria: {comparator}. Optional Criteria: {wholeDays}.
  BeforeOrEqualTo = "BeforeOrEqualTo", // Date is before or equal to comparator date. Required Criteria: {comparator}. Optional Criteria: {wholeDays}.
  Between = "Between", // Between lowerBound and upperBound dates. Required Criteria: {lowerBound, upperBound}. Optional Criteria: {wholeDays, exclusive}.
  Equals = "Equals", // Equals comparator criterion. Required Criteria: {comparator}. Optional Criteria: {wholeDays, exclusive}.
  LastMonth = "LastMonth", // Date is last month.
  LastQuarter = "LastQuarter", // Date is last quarter.
  LastWeek = "LastWeek", // Date is last week.
  LastYear = "LastYear", // Date is last year.
  NextMonth = "NextMonth", // Date is next month.
  NextQuarter = "NextQuarter", // Date is next quarter.
  NextWeek = "NextWeek", // Date is next week.
  NextYear = "NextYear", // Date is next year.
  ThisMonth = "ThisMonth", // Date is this month.
  ThisQuarter = "ThisQuarter", // Date is this quarter.
  ThisWeek = "ThisWeek", // Date is this week.
  ThisYear = "ThisYear", // Date is this year.
  Today = "Today", // Date is today.
  Tomorrow = "Tomorrow", // Date is tomorrow.
  Unknown = "Unknown", // DateFilterCondition is unknown or unsupported.
  YearToDate = "YearToDate", // Date is in the same year to date.
  Yesterday = "Yesterday", // Date is yesterday.
  AboveAverage = "AboveAverage", // Above average.
  BelowAverage = "BelowAverage", // Below average.
  Day = "Day", // Day.
  Hour = "Hour", // Hour.
  Minute = "Minute", // Minute.
  Month = "Month", // Month.
  Second = "Second", // Second.
  Year = "Year", // Year.
  BottomItems = "BottomItems", // Bottom items.
  BottomPercent = "BottomPercent", // Bottom percent.
  CellColor = "CellColor", // Cell color.
  Custom = "Custom", // Custom filter.
  Dynamic = "Dynamic", // Dynamic filter.
  FontColor = "FontColor", // Font color.
  Icon = "Icon", // Icon filter.
  TopItems = "TopItems", // Top items.
  TopPercent = "TopPercent", // Top percent.
  Values = "Values", // Values filter.
  And = "And", // Logical AND.
  Or = "Or", // Logical OR.
  BeginsWith = "BeginsWith", // Label begins with substring criterion. Required Criteria: {substring}. Optional Criteria: {exclusive}.
  Contains = "Contains", // Label contains substring criterion. Required Criteria: {substring}. Optional Criteria: {exclusive}.
  EndsWith = "EndsWith", // Label ends with substring criterion. Required Criteria: {substring}. Optional Criteria: {exclusive}.
  GreaterThan = "GreaterThan", // Greater than comparator criterion. Required Criteria: {comparator}.
  GreaterThanOrEqualTo = "GreaterThanOrEqualTo", // Greater than or equal to comparator criterion. Required Criteria: {comparator}.
  LessThan = "LessThan", // Less than comparator criterion. Required Criteria: {comparator}.
  LessThanOrEqualTo = "LessThanOrEqualTo", // Less than or equal to comparator criterion. Required Criteria: {comparator}.
  BottomN = "BottomN", // In bottom N (threshold) [items, percent, sum] of value category. Required Criteria: {value, threshold, selectionType}.
  TopN = "TopN", // In top N (threshold) [items, percent, sum] of value category. Required Criteria: {value, threshold, selectionType}.
}

// Sort

export enum SortDataOption {
  Normal = "normal",
  TextAsNumber = "textAsNumber",
}

export enum SortOn {
  Value = "value",
  CellColor = "cellColor",
  FontColor = "fontColor",
  Icon = "icon",
}

export enum SortMethod {
  PinYinSort = "pinYinSort",
  StrokeSort = "strokeSort",
}

export enum SortOrientation {
  Rows = "rows",
  Columns = "columns",
}

export interface SortField {
  key: number;
  ascending: boolean;
  color?: string;
  dataOption?: SortDataOption;
  icon?: Excel.IconSet;
  subField?: string;
}

// Data Validation

export enum DataValidation {
  Information = "Information", // Represents the information data validation type.
  Stop = "Stop", // Represents the stop data validation type.
  Warning = "Warning", // Represents the warning data validation type.
  Between = "Between", // Represents the between data validation type.
  EqualTo = "EqualTo", // Represents the equal to data validation type.
  GreaterThan = "GreaterThan", // Represents the greater than data validation type.
  GreaterThanOrEqualTo = "GreaterThanOrEqualTo", // Represents the greater than or equal to data validation type.
  LessThan = "LessThan", // Represents the less than data validation type.
  LessThanOrEqualTo = "LessThanOrEqualTo", // Represents the less than or equal to data validation type.
  NotBetween = "NotBetween", // Represents the not between data validation type.
  NotEqualTo = "NotEqualTo", // Represents the not equal to data validation type.
  Custom = "Custom", // The custom data validation type.
  Date = "Date", // The date data validation type.
  Decimal = "Decimal", // The decimal data validation type.
  Inconsistent = "Inconsistent", // Inconsistent data validation, indicating different rules on different cells.
  List = "List", // The list data validation type.
  MixedCriteria = "MixedCriteria", // Mixed criteria data validation, indicating validation present on some but not all cells.
  None = "None", // None, indicating no data validation in the range.
  TextLength = "TextLength", // The text length data validation type.
  Time = "Time", // The time data validation type.
  WholeNumber = "WholeNumber", // The whole number data validation type.
}

// Pivot Table
export enum PivotTableBasicOptions {
  Column = "Column",
  Data = "Data",
  Filter = "Filter",
  Row = "Row",
  Unknown = "Unknown",
}

export enum PivotTableFilterTypes {
  BottomItems = "BottomItems",
  BottomPercent = "BottomPercent",
  BottomSum = "BottomSum",
  TopItems = "TopItems",
  TopPercent = "TopPercent",
  TopSum = "TopSum",
  Date = "Date",
  Label = "Label",
  Manual = "Manual",
  Value = "Value",
}

export enum PivotTableLayoutTypes {
  Compact = "Compact",
  Outline = "Outline",
  Tabular = "Tabular",
}

export enum PivotTableValueFilterConditions {
  Between = "Between",
  BottomN = "BottomN",
  Equals = "Equals",
  GreaterThan = "GreaterThan",
  GreaterThanOrEqualTo = "GreaterThanOrEqualTo",
  LessThan = "LessThan",
  LessThanOrEqualTo = "LessThanOrEqualTo",
  TopN = "TopN",
}

export enum PivotAggregationFunction {
  Automatic = "Automatic",
  Average = "Average",
  Count = "Count",
  CountNumbers = "CountNumbers",
  Max = "Max",
  Min = "Min",
  Product = "Product",
  StandardDeviation = "StandardDeviation",
  StandardDeviationP = "StandardDeviationP",
  Sum = "Sum",
  Variance = "Variance",
  VarianceP = "VarianceP",
}

// Range

export enum RangeCopyType {
  All = "All",
  ColumnWidths = "ColumnWidths",
  Formats = "Formats",
  Formulas = "Formulas",
  Link = "Link",
  Values = "Values",
}

export enum RangeUnderlineStyle {
  Double = "Double",
  DoubleAccountant = "DoubleAccountant",
  None = "None",
  Single = "Single",
  SingleAccountant = "SingleAccountant",
}

export enum RangeValueType {
  Boolean = "Boolean",
  Double = "Double",
  Empty = "Empty",
  Error = "Error",
  Integer = "Integer",
  RichValue = "RichValue",
  String = "String",
  Unknown = "Unknown",
}

// Entity Card

export enum EntityCardLayout {
  Array = "Array", // Array layout of the entity card.
  Entity = "Entity", // Entity layout of the entity card.
}

export enum EntityCardIcon {
  Accessibility = "Accessibility", // Accessibility icon.
  Airplane = "Airplane", // Airplane icon.
  AirplaneTakeOff = "AirplaneTakeOff", // Airplane taking off icon.
  Album = "Album", // Album icon.
  Alert = "Alert", // Alert icon.
  AlertUrgent = "AlertUrgent", // Alert urgent icon.
  Animal = "Animal", // Animal icon. Displays as a pawprint.
  AnimalCat = "AnimalCat", // Animal cat icon.
  AnimalDog = "AnimalDog", // Animal dog icon.
  AnimalRabbit = "AnimalRabbit", // Animal rabbit icon.
  AnimalTurtle = "AnimalTurtle", // Animal turtle icon.
  AppFolder = "AppFolder", // App folder icon.
  AppGeneric = "AppGeneric", // App generic icon.
  Apple = "Apple", // Apple icon.
  ApprovalsApp = "ApprovalsApp", // Approvals app icon.
  Archive = "Archive", // Archive icon.
  ArchiveMultiple = "ArchiveMultiple", // Archive multiple icon.
  ArrowTrendingLines = "ArrowTrendingLines", // Arrow trending lines icon.
  Art = "Art", // Art icon. Displays as a paint palette.
  Atom = "Atom", // Atom icon.
  Attach = "Attach", // Attach icon.
  Automobile = "Automobile", // Automobile icon.
  Autosum = "Autosum", // Autosum icon.
  Backpack = "Backpack", // Backpack icon.
  Badge = "Badge", // Badge icon.
  Balloon = "Balloon", // Balloon icon.
  Bank = "Bank", // Bank icon. Displays as a building with pillars and a triangular roof.
  BarcodeScanner = "BarcodeScanner", // Barcode scanner icon.
  Basketball = "Basketball", // Basketball icon.
  Battery0 = "Battery0", // Battery empty icon.
  Battery10 = "Battery10", // Battery full icon.
  Beach = "Beach", // Beach icon.
  Beaker = "Beaker", // Beaker icon.
  Bed = "Bed", // Bed icon.
  BinFull = "BinFull", // Bin full icon.
  Bird = "Bird", // Bird icon.
  Bluetooth = "Bluetooth", // Bluetooth icon.
  Board = "Board", // Board icon.
  BoardGames = "BoardGames", // Board games icon.
  Book = "Book", // Book icon.
  Bookmark = "Bookmark", // Bookmark icon.
  BookmarkMultiple = "BookmarkMultiple", // Bookmark multiple icon.
  Bot = "Bot", // Bot icon.
  BowlChopsticks = "BowlChopsticks", // Bowl chopsticks icon.
  Box = "Box", // Box icon.
  BoxMultiple = "BoxMultiple", // Box multiple icon.
  BrainCircuit = "BrainCircuit", // Brain circuit icon.
  Branch = "Branch", // Branch icon.
  BranchFork = "BranchFork", // Branch fork icon.
  BranchRequest = "BranchRequest", // Branch request icon.
  Bridge = "Bridge", // Bridge icon.
  Briefcase = "Briefcase", // Briefcase icon.
  BriefcaseMedical = "BriefcaseMedical", // Briefcase medical icon.
  BroadActivityFeed = "BroadActivityFeed", // Broad activity feed icon.
  Broom = "Broom", // Broom icon.
  Bug = "Bug", // Bug icon.
  Building = "Building", // Building icon.
  BuildingBank = "BuildingBank", // Building bank icon.
  BuildingFactory = "BuildingFactory", // Building factory icon.
  BuildingGovernment = "BuildingGovernment", // Building government icon.
  BuildingHome = "BuildingHome", // Building home icon.
  BuildingLighthouse = "BuildingLighthouse", // Building lighthouse icon.
  BuildingMultiple = "BuildingMultiple", // Building multiple icon.
  BuildingRetail = "BuildingRetail", // Building retail icon.
  BuildingRetailMore = "BuildingRetailMore", // Building retail more icon.
  BuildingRetailToolbox = "BuildingRetailToolbox", // Building retail toolbox icon.
  BuildingShop = "BuildingShop", // Building shop icon.
  BuildingSkyscraper = "BuildingSkyscraper", // Building skyscraper icon.
  Calculator = "Calculator", // Calculator icon.
  CalendarLtr = "CalendarLtr", // Calendar left to right icon.
  CalendarRtl = "CalendarRtl", // Calendar right to left icon.
  Call = "Call", // Call icon.
  CalligraphyPen = "CalligraphyPen", // Calligraphy pen icon.
  Camera = "Camera", // Camera icon.
  CameraDome = "CameraDome", // Camera dome icon.
  Car = "Car", // Car icon.
  Cart = "Cart", // Cart icon.
  Cat = "Cat", // Cat icon.
  Certificate = "Certificate", // Certificate icon.
  ChartMultiple = "ChartMultiple", // Chart multiple icon.
  Chat = "Chat", // Chat icon.
  ChatMultiple = "ChatMultiple", // Chat multiple icon.
  ChatVideo = "ChatVideo", // Chat video icon.
  Check = "Check", // Check icon.
  CheckboxChecked = "CheckboxChecked", // Checkbox checked icon.
  CheckboxUnchecked = "CheckboxUnchecked", // Checkbox unchecked icon.
  Checkmark = "Checkmark", // Checkmark icon.
  Chess = "Chess", // Chess icon.
  City = "City", // City icon. Displays as multiple tall buildings.
  Class = "Class", // Class icon.
  Classification = "Classification", // Classification icon.
  Clipboard = "Clipboard", // Clipboard icon.
  ClipboardDataBar = "ClipboardDataBar", // Clipboard data bar icon.
  ClipboardPulse = "ClipboardPulse", // Clipboard pulse icon.
  ClipboardTask = "ClipboardTask", // Clipboard task icon.
  Clock = "Clock", // Clock icon.
  ClockAlarm = "ClockAlarm", // Clock alarm icon.
  Cloud = "Cloud", // Cloud icon.
  CloudWords = "CloudWords", // Cloud words icon.
  Code = "Code", // Code icon.
  Collections = "Collections", // Collections icon.
  Comment = "Comment", // Comment icon.
  CommentMultiple = "CommentMultiple", // Comment multiple icon.
  Communication = "Communication", // Communication icon.
  CompassNorthwest = "CompassNorthwest", // Compass northwest icon.
  ConferenceRoom = "ConferenceRoom", // Conference room icon.
  Connector = "Connector", // Connector icon.
  Constellation = "Constellation", // Constellation icon. Displays dots in the shape of Ursa Major.
  ContactCard = "ContactCard", // Contact card icon.
  Cookies = "Cookies", // Cookies icon.
  Couch = "Couch", // Couch icon.
  CreditCardPerson = "CreditCardPerson", // Credit card person icon.
  CreditCardToolbox = "CreditCardToolbox", // Credit card toolbox icon.
  Cube = "Cube", // Cube icon.
  CubeMultiple = "CubeMultiple", // Cube multiple icon.
  CubeTree = "CubeTree", // Cube tree icon.
  CurrencyDollarEuro = "CurrencyDollarEuro", // Currency dollar euro icon.
  CurrencyDollarRupee = "CurrencyDollarRupee", // Currency dollar rupee icon.
  DataArea = "DataArea", // Data area icon.
  Database = "Database", // Database icon.
  DatabaseMultiple = "DatabaseMultiple", // Database multiple icon.
  DataFunnel = "DataFunnel", // Data funnel icon.
  DataHistogram = "DataHistogram", // Data histogram icon.
  DataLine = "DataLine", // Data line icon.
  DataPie = "DataPie", // Data pie icon.
  DataScatter = "DataScatter", // Data scatter icon.
  DataSunburst = "DataSunburst", // Data sunburst icon.
  DataTreemap = "DataTreemap", // Data treemap icon.
  DataWaterfall = "DataWaterfall", // Data waterfall icon.
  DataWhisker = "DataWhisker", // Data whisker icon.
  Dentist = "Dentist", // Dentist icon.
  DesignIdeas = "DesignIdeas", // Design ideas icon.
  Desktop = "Desktop", // Desktop icon.
  DesktopMac = "DesktopMac", // Desktop Mac icon.
  DeveloperBoard = "DeveloperBoard", // Developer board icon.
  DeviceMeetingRoom = "DeviceMeetingRoom", // Device meeting room icon.
  Diagram = "Diagram", // Diagram icon.
  Dialpad = "Dialpad", // Dialpad icon.
  Diamond = "Diamond", // Diamond icon.
  Dinosaur = "Dinosaur", // Dinosaur icon. Displays as a long-necked dinosaur, similar to a Brachiosaurus.
  Directions = "Directions", // Directions icon.
  Disaster = "Disaster", // Disaster icon. Displays as a house sinking in a flood.
  Diversity = "Diversity", // Diversity icon.
  DNA = "DNA", // DNA icon.
  Doctor = "Doctor", // Doctor icon.
  Document = "Document", // Document icon.
  DocumentData = "DocumentData", // Document data icon.
  DocumentLandscape = "DocumentLandscape", // Document landscape icon.
  DocumentMultiple = "DocumentMultiple", // Document multiple icon.
  DocumentPdf = "DocumentPdf", // Document PDF icon.
  DocumentQueue = "DocumentQueue", // Document queue icon.
  DocumentText = "DocumentText", // Document text icon.
  Dog = "Dog", // Dog icon.
  Door = "Door", // Door icon.
  DoorTag = "DoorTag", // Door tag icon.
  Drafts = "Drafts", // Drafts icon.
  Drama = "Drama", // Drama icon. Displays as a pair of theatre masks.
  DrinkBeer = "DrinkBeer", // Drink beer icon.
  DrinkCoffee = "DrinkCoffee", // Drink coffee icon.
  DrinkMargarita = "DrinkMargarita", // Drink margarita icon.
  DrinkToGo = "DrinkToGo", // Drink to go icon.
  DrinkWine = "DrinkWine", // Drink wine icon.
  DriveTrain = "DriveTrain", // Drive train icon.
  Drop = "Drop", // Drop icon.
  DualScreen = "DualScreen", // Dual screen icon.
  Dumbbell = "Dumbbell", // Dumbbell icon.
  Earth = "Earth", // Earth icon.
  Emoji = "Emoji", // Emoji icon.
  EmojiAngry = "EmojiAngry", // Emoji angry icon.
  EmojiHand = "EmojiHand", // Emoji hand icon.
  EmojiLaugh = "EmojiLaugh", // Emoji laugh icon.
  EmojiMeh = "EmojiMeh", // Emoji meh icon.
  EmojiMultiple = "EmojiMultiple", // Emoji multiple icon.
  EmojiSad = "EmojiSad", // Emoji sad icon.
  EmojiSadSlight = "EmojiSadSlight", // Emoji sad slight icon.
  EmojiSmileSlight = "EmojiSmileSlight", // Emoji smile slight icon.
  EmojiSparkle = "EmojiSparkle", // Emoji sparkle icon.
  EmojiSurprise = "EmojiSurprise", // Emoji surprise icon.
  Engine = "Engine", // Engine icon.
  Eraser = "Eraser", // Eraser icon.
  Eye = "Eye", // Eye icon.
  Eyedropper = "Eyedropper", // Eyedropper icon.
  Fax = "Fax", // Fax icon.
  Fingerprint = "Fingerprint", // Fingerprint icon.
  FirstAid = "FirstAid", // First aid icon. Displays as a briefcase with a medical cross symbol.
  Flag = "Flag", // Flag icon.
  Flash = "Flash", // Flash icon.
  Flashlight = "Flashlight", // Flashlight icon.
  Flow = "Flow", // Flow icon.
  Flowchart = "Flowchart", // Flowchart icon.
  Folder = "Folder", // Folder icon.
  FolderOpen = "FolderOpen", // Folder open icon.
  FolderOpenVertical = "FolderOpenVertical", // Folder open vertical icon.
  FolderPerson = "FolderPerson", // Folder person icon.
  FolderZip = "FolderZip", // Folder zip icon.
  Food = "Food", // Food icon.
  FoodApple = "FoodApple", // Food apple icon.
  FoodCake = "FoodCake", // Food cake icon.
  FoodEgg = "FoodEgg", // Food egg icon.
  FoodGrains = "FoodGrains", // Food grains icon.
  FoodPizza = "FoodPizza", // Food pizza icon.
  FoodToast = "FoodToast", // Food toast icon.
  Galaxy = "Galaxy", // Galaxy icon.
  Games = "Games", // Games icon.
  GanttChart = "GanttChart", // Gantt chart icon.
  Gas = "Gas", // Gas icon.
  GasPump = "GasPump", // Gas pump icon.
  Gauge = "Gauge", // Gauge icon.
  Gavel = "Gavel", // Gavel icon.
  Generic = "Generic", // The default icon.
  Gift = "Gift", // Gift icon.
  GiftCard = "GiftCard", // Gift card icon.
  Glasses = "Glasses", // Glasses icon.
  Globe = "Globe", // Globe icon.
  GlobeSurface = "GlobeSurface", // Globe surface icon.
  Grid = "Grid", // Grid icon.
  GridDots = "GridDots", // Grid dots icon.
  GridKanban = "GridKanban", // Grid Kanban icon.
  Guardian = "Guardian", // Guardian icon.
  Guest = "Guest", // Guest icon.
  Guitar = "Guitar", // Guitar icon.
  HandLeft = "HandLeft", // Hand left icon.
  HandRight = "HandRight", // Hand right icon.
  Handshake = "Handshake", // Handshake icon.
  HardDrive = "HardDrive", // Hard drive icon.
  HatGraduation = "HatGraduation", // Graduation hat icon. Displays as a hat with a tassel.
  Headphones = "Headphones", // Headphones icon.
  HeadphonesSoundWave = "HeadphonesSoundWave", // Headphones sound wave icon.
  Headset = "Headset", // Headset icon.
  HeadsetVr = "HeadsetVr", // Headset VR icon.
  Heart = "Heart", // Heart icon.
  HeartBroken = "HeartBroken", // Heart broken icon.
  HeartCircle = "HeartCircle", // Heart circle icon.
  HeartHuman = "HeartHuman", // Human heart icon.
  HeartPulse = "HeartPulse", // Heart pulse icon.
  History = "History", // History icon.
  Home = "Home", // Home icon.
  HomeMore = "HomeMore", // Home more icon.
  HomePerson = "HomePerson", // Home person icon.
  Icons = "Icons", // Icons icon.
  Image = "Image", // Image icon.
  ImageGlobe = "ImageGlobe", // Image globe icon.
  ImageMultiple = "ImageMultiple", // Image multiple icon.
  Iot = "Iot", // IoT icon.
  Joystick = "Joystick", // Joystick icon.
  Justice = "Justice", // Justice icon. Displays as the scales of justice.
  Key = "Key", // Key icon.
  Keyboard = "Keyboard", // Keyboard icon.
  KeyboardLayoutSplit = "KeyboardLayoutSplit", // Keyboard layout split icon.
  KeyMultiple = "KeyMultiple", // Key multiple icon.
  Languages = "Languages", // Languages icon. Displays as a document and a globe.
  Laptop = "Laptop", // Laptop icon.
  Lasso = "Lasso", // Lasso icon.
  LauncherSettings = "LauncherSettings", // Launcher settings icon.
  Layer = "Layer", // Layer icon.
  Leaf = "Leaf", // Leaf icon.
  LeafOne = "LeafOne", // Leaf one icon.
  LeafThree = "LeafThree", // Leaf three icon.
  LeafTwo = "LeafTwo", // Leaf two icon.
  Library = "Library", // Library icon.
  Lightbulb = "Lightbulb", // Lightbulb icon.
  LightbulbFilament = "LightbulbFilament", // Lightbulb filament icon.
  Likert = "Likert", // Likert icon.
  Link = "Link", // Link icon.
  LocalLanguage = "LocalLanguage", // Local language icon.
  Location = "Location", // Location icon. Displays as a map marker.
  LockClosed = "LockClosed", // Lock closed icon.
  LockMultiple = "LockMultiple", // Lock multiple icon.
  LockOpen = "LockOpen", // Lock open icon.
  Lottery = "Lottery", // Lottery icon.
  Luggage = "Luggage", // Luggage icon.
  Mail = "Mail", // Mail icon.
  MailInbox = "MailInbox", // Mail inbox icon.
  MailMultiple = "MailMultiple", // Mail multiple icon.
  Map = "Map", // Map icon.
  MapPin = "MapPin", // Map pin icon.
  Markdown = "Markdown", // Markdown icon.
  MathFormula = "MathFormula", // Math formula icon.
  MathSymbols = "MathSymbols", // Math symbols icon.
  Max = "Max", // Max icon.
  Megaphone = "Megaphone", // Megaphone icon.
  MegaphoneLoud = "MegaphoneLoud", // Megaphone loud icon.
  Mention = "Mention", // Mention icon.
  Mic = "Mic", // Mic icon.
  Microscope = "Microscope", // Microscope icon.
  Midi = "Midi", // Midi icon.
  Molecule = "Molecule", // Molecule icon.
  Money = "Money", // Money icon. Displays as paper money and coins.
  MoneyHand = "MoneyHand", // Money hand icon.
  Mountain = "Mountain", // Mountain icon.
  MovieCamera = "MovieCamera", // Movie camera icon. Displays as a video camera.
  MoviesAndTv = "MoviesAndTv", // Movies and TV icon.
  MusicNote = "MusicNote", // Music note icon.
  MusicNote1 = "MusicNote1", // Music note icon.
  MusicNote2 = "MusicNote2", // Music double note icon.
  MyLocation = "MyLocation", // My location icon.
  NByN = "NByN", // N by N icon. Displays as a three by three grid.
  NByOne = "NByOne", // N by one icon. Displays as a three by one grid.
  News = "News", // News icon.
  NotablePeople = "NotablePeople", // Notable people icon.
  Note = "Note", // Note icon.
  Notebook = "Notebook", // Notebook icon.
  Notepad = "Notepad", // Notepad icon.
  NotepadPerson = "NotepadPerson", // Notepad person icon.
  OneByN = "OneByN", // One by N icon. Displays as a one by three grid.
  OneByOne = "OneByOne", // One by one icon. Displays as a one by one grid.
  Options = "Options", // Options icon.
  Organization = "Organization", // Organization icon.
  OrganizationHorizontal = "OrganizationHorizontal", // Organization horizontal icon.
  Oval = "Oval", // Oval icon.
  PaintBrush = "PaintBrush", // Paint brush icon.
  PaintBucket = "PaintBucket", // Paint bucket icon.
  PartlySunnyWeather = "PartlySunnyWeather", // Partly sunny weather icon.
  Password = "Password", // Password icon.
  Patch = "Patch", // Patch icon.
  Patient = "Patient", // Patient icon.
  Payment = "Payment", // Payment icon.
  Pen = "Pen", // Pen icon.
  Pentagon = "Pentagon", // Pentagon icon.
  People = "People", // People icon.
  PeopleAudience = "PeopleAudience", // People audience icon.
  PeopleCall = "PeopleCall", // People call icon.
  PeopleCommunity = "PeopleCommunity", // People community icon.
  PeopleMoney = "PeopleMoney", // People money icon.
  PeopleQueue = "PeopleQueue", // People queue icon.
  PeopleTeam = "PeopleTeam", // People team icon.
  PeopleToolbox = "PeopleToolbox", // People toolbox icon.
  Person = "Person", // Person icon.
  PersonBoard = "PersonBoard", // Person board icon.
  PersonCall = "PersonCall", // Person call icon.
  PersonChat = "PersonChat", // Person chat icon.
  PersonFeedback = "PersonFeedback", // Person feedback icon.
  PersonSupport = "PersonSupport", // Person support icon.
  PersonVoice = "PersonVoice", // Person voice icon.
  Phone = "Phone", // Phone icon.
  PhoneDesktop = "PhoneDesktop", // Phone desktop icon.
  PhoneLaptop = "PhoneLaptop", // Phone laptop icon.
  PhoneShake = "PhoneShake", // Phone shake icon.
  PhoneTablet = "PhoneTablet", // Phone tablet icon.
  PhoneVibrate = "PhoneVibrate", // Phone vibrate icon.
  PhotoFilter = "PhotoFilter", // Photo filter icon.
  Pi = "Pi", // Pi icon.
  PictureInPicture = "PictureInPicture", // Picture in picture icon.
  Pilates = "Pilates", // Pilates icon.
  Pill = "Pill", // Pill icon.
  Pin = "Pin", // Pin icon.
  Pipeline = "Pipeline", // Pipeline icon.
  Planet = "Planet", // Planet icon.
  PlayingCards = "PlayingCards", // Playing cards icon.
  PlugConnected = "PlugConnected", // Plug connected icon.
  PlugDisconnected = "PlugDisconnected", // Plug disconnected icon.
  PointScan = "PointScan", // Point scan icon. Displays as a target focus symbol.
  Poll = "Poll", // Poll icon.
  Power = "Power", // Power icon.
  Predictions = "Predictions", // Predictions icon.
  Premium = "Premium", // Premium icon.
  Presenter = "Presenter", // Presenter icon.
  PreviewLink = "PreviewLink", // Preview link icon.
  Print = "Print", // Print icon.
  Production = "Production", // Production icon.
  Prohibited = "Prohibited", // Prohibited icon.
  ProjectionScreen = "ProjectionScreen", // Projection screen icon.
  ProtocolHandler = "ProtocolHandler", // Protocol handler icon.
  Pulse = "Pulse", // Pulse icon.
  PulseSquare = "PulseSquare", // Pulse square icon.
  PuzzlePiece = "PuzzlePiece", // Puzzle piece icon.
  QrCode = "QrCode", // QR code icon.
  Radar = "Radar", // Radar icon.
  Ram = "Ram", // Ram icon.
  ReadingList = "ReadingList", // Reading list icon.
  RealEstate = "RealEstate", // Real estate icon.
  Receipt = "Receipt", // Receipt icon.
  Reward = "Reward", // Reward icon.
  Rhombus = "Rhombus", // Rhombus icon.
  Ribbon = "Ribbon", // Ribbon icon.
  RibbonStar = "RibbonStar", // Ribbon star icon.
  RoadCone = "RoadCone", // Road cone icon.
  Rocket = "Rocket", // Rocket icon.
  Router = "Router", // Router icon.
  Rss = "Rss", // RSS icon.
  Ruler = "Ruler", // Ruler icon.
  Run = "Run", // Run icon.
  Running = "Running", // Running icon.
  Satellite = "Satellite", // Satellite icon.
  Save = "Save", // Save icon.
  Savings = "Savings", // Savings icon.
  Scales = "Scales", // Scales icon.
  Scan = "Scan", // Scan icon.
  Scratchpad = "Scratchpad", // Scratchpad icon.
  ScreenPerson = "ScreenPerson", // Screen person icon.
  Screenshot = "Screenshot", // Screenshot icon.
  Search = "Search", // Search icon.
  SerialPort = "SerialPort", // Serial port icon.
  Server = "Server", // Server icon.
  ServerMultiple = "ServerMultiple", // Server multiple icon.
  ServiceBell = "ServiceBell", // Service bell icon.
  Settings = "Settings", // Settings icon.
  Shapes = "Shapes", // Shapes icon.
  Shield = "Shield", // Shield icon.
  ShieldTask = "ShieldTask", // Shield task icon.
  ShoppingBag = "ShoppingBag", // Shopping bag icon.
  Signature = "Signature", // Signature icon.
  Sim = "Sim", // Sim icon.
  Sleep = "Sleep", // Sleep icon.
  Smartwatch = "Smartwatch", // Smartwatch icon.
  SoundSource = "SoundSource", // Sound source icon.
  SoundWaveCircle = "SoundWaveCircle", // Sound wave circle icon.
  Sparkle = "Sparkle", // Sparkle icon.
  Speaker0 = "Speaker0", // Speaker icon.
  Speaker2 = "Speaker2", // Speaker with sound wave icon.
  Sport = "Sport", // Sport icon.
  SportAmericanFootball = "SportAmericanFootball", // Sport american football icon.
  SportBaseball = "SportBaseball", // Sport baseball icon.
  SportBasketball = "SportBasketball", // Sport basketball icon.
  SportHockey = "SportHockey", // Sport hockey icon.
  SportSoccer = "SportSoccer", // Sport soccer icon.
  SquareMultiple = "SquareMultiple", // Square multiple icon.
  SquareShadow = "SquareShadow", // Square shadow icon.
  SquaresNested = "SquaresNested", // Squares nested icon.
  Stack = "Stack", // Stack icon.
  StackStar = "StackStar", // Stack star icon.
  Star = "Star", // Star icon.
  StarFilled = "StarFilled", // Star filled icon.
  StarHalf = "StarHalf", // Star half icon.
  StarLineHorizontal3 = "StarLineHorizontal3", // Star with 3 horizontal lines icon.
  StarOneQuarter = "StarOneQuarter", // Star one quarter icon.
  StarThreeQuarter = "StarThreeQuarter", // Star three quarter icon.
  Status = "Status", // Status icon.
  Steps = "Steps", // Steps icon.
  Stethoscope = "Stethoscope", // Stethoscope icon.
  Sticker = "Sticker", // Sticker icon.
  Storage = "Storage", // Storage icon.
  Stream = "Stream", // Stream icon.
  StreamInput = "StreamInput", // Stream input icon.
  StreamInputOutput = "StreamInputOutput", // Stream input output icon.
  StreamOutput = "StreamOutput", // Stream output icon.
  StyleGuide = "StyleGuide", // Style guide icon.
  SubGrid = "SubGrid", // Sub grid icon.
  Subtitles = "Subtitles", // Subtitles icon.
  SurfaceEarbuds = "SurfaceEarbuds", // Surface earbuds icon.
  SurfaceHub = "SurfaceHub", // Surface hub icon.
  Symbols = "Symbols", // Symbols icon.
  Syringe = "Syringe", // Syringe icon.
  System = "System", // System icon.
  TabDesktop = "TabDesktop", // Tab desktop icon.
  TabInprivateAccount = "TabInprivateAccount", // Tab InPrivate account icon.
  Table = "Table", // Table icon.
  TableImage = "TableImage", // Table image icon.
  TableMultiple = "TableMultiple", // Table multiple icon.
  Tablet = "Tablet", // Tablet icon.
  Tabs = "Tabs", // Tabs icon.
  Tag = "Tag", // Tag icon.
  TagCircle = "TagCircle", // Tag circle icon.
  TagMultiple = "TagMultiple", // Tag multiple icon.
  Target = "Target", // Target icon.
  TargetArrow = "TargetArrow", // Target arrow icon.
  Teddy = "Teddy", // Teddy icon.
  Temperature = "Temperature", // Temperature icon.
  Tent = "Tent", // Tent icon.
  TetrisApp = "TetrisApp", // Tetris app icon.
  Textbox = "Textbox", // Textbox icon.
  TextQuote = "TextQuote", // Text quote icon.
  Thinking = "Thinking", // Thinking icon.
  ThumbDislike = "ThumbDislike", // Thumb dislike icon.
  ThumbLike = "ThumbLike", // Thumb like icon.
  TicketDiagonal = "TicketDiagonal", // Ticket diagonal icon.
  TicketHorizontal = "TicketHorizontal", // Ticket horizontal icon.
  TimeAndWeather = "TimeAndWeather", // Time and weather icon.
  Timeline = "Timeline", // Timeline icon.
  Timer = "Timer", // Timer icon.
  Toolbox = "Toolbox", // Toolbox icon.
  TopSpeed = "TopSpeed", // Top speed icon.
  Translate = "Translate", // Translate icon.
  Transmission = "Transmission", // Transmission icon.
  TreeDeciduous = "TreeDeciduous", // Tree deciduous icon.
  TreeEvergreen = "TreeEvergreen", // Tree evergreen icon.
  Trophy = "Trophy", // Trophy icon.
  Tv = "Tv", // TV icon.
  TvUsb = "TvUsb", // TV USB icon.
  Umbrella = "Umbrella", // Umbrella icon.
  UsbPlug = "UsbPlug", // USB plug icon.
  UsbStick = "UsbStick", // USB stick icon.
  Vault = "Vault", // Vault icon.
  VehicleBicycle = "VehicleBicycle", // Vehicle bicycle icon.
  VehicleBus = "VehicleBus", // Vehicle bus icon.
  VehicleCab = "VehicleCab", // Vehicle cab icon.
  VehicleCar = "VehicleCar", // Vehicle car icon.
  VehicleCarCollision = "VehicleCarCollision", // Vehicle car collision icon.
  VehicleCarProfileLtr = "VehicleCarProfileLtr", // Vehicle car profile left-to-right icon.
  VehicleCarProfileRtl = "VehicleCarProfileRtl", // Vehicle car profile right-to-left icon.
  VehicleShip = "VehicleShip", // Vehicle ship icon.
  VehicleSubway = "VehicleSubway", // Vehicle subway icon.
  VehicleTruck = "VehicleTruck", // Vehicle truck icon.
  VehicleTruckBag = "VehicleTruckBag", // Vehicle truck bag icon.
  VehicleTruckCube = "VehicleTruckCube", // Vehicle truck cube icon.
  VehicleTruckProfile = "VehicleTruckProfile", // Vehicle truck profile icon.
  Video = "Video", // Video icon.
  Video360 = "Video360", // Video 360 icon.
  VideoChat = "VideoChat", // Video chat icon.
  VideoClip = "VideoClip", // Video clip icon.
  VideoClipMultiple = "VideoClipMultiple", // Video clip multiple icon.
  VideoPerson = "VideoPerson", // Video person icon.
  VideoRecording = "VideoRecording", // Video recording icon.
  VideoSecurity = "VideoSecurity", // Video security icon.
  ViewDesktop = "ViewDesktop", // View desktop icon.
  ViewDesktopMobile = "ViewDesktopMobile", // View desktop mobile icon.
  Violin = "Violin", // Violin icon.
  VirtualNetwork = "VirtualNetwork", // Virtual network icon.
  Voicemail = "Voicemail", // Voicemail icon.
  Vote = "Vote", // Vote icon.
  WalkieTalkie = "WalkieTalkie", // Walkie talkie icon.
  Wallet = "Wallet", // Wallet icon.
  WalletCreditCard = "WalletCreditCard", // Wallet credit card icon.
  Wallpaper = "Wallpaper", // Wallpaper icon.
  Wand = "Wand", // Wand icon.
  Warning = "Warning", // Warning icon.
  WeatherBlowingSnow = "WeatherBlowingSnow", // Weather blowing snow icon.
  WeatherCloudy = "WeatherCloudy", // Weather cloudy icon.
  WeatherDrizzle = "WeatherDrizzle", // Weather drizzle icon.
  WeatherDuststorm = "WeatherDuststorm", // Weather duststorm icon.
  WeatherFog = "WeatherFog", // Weather fog icon.
  WeatherHailDay = "WeatherHailDay", // Weather hail day icon.
  WeatherHailNight = "WeatherHailNight", // Weather hail night icon.
  WeatherHaze = "WeatherHaze", // Weather haze icon.
  WeatherMoon = "WeatherMoon", // Weather moon icon.
  WeatherPartlyCloudyDay = "WeatherPartlyCloudyDay", // Weather partly cloudy day icon.
  WeatherPartlyCloudyNight = "WeatherPartlyCloudyNight", // Weather partly cloudy night icon.
  WeatherRain = "WeatherRain", // Weather rain icon.
  WeatherRainShowersDay = "WeatherRainShowersDay", // Weather rain showers day icon.
  WeatherRainShowersNight = "WeatherRainShowersNight", // Weather rain showers night icon.
  WeatherRainSnow = "WeatherRainSnow", // Weather rain snow icon.
  WeatherSnow = "WeatherSnow", // Weather snow icon.
  WeatherSnowflake = "WeatherSnowflake", // Weather snowflake icon.
  WeatherSnowShowerDay = "WeatherSnowShowerDay", // Weather snow shower day icon.
  WeatherSnowShowerNight = "WeatherSnowShowerNight", // Weather snow shower night icon.
  WeatherSqualls = "WeatherSqualls", // Weather squalls icon.
  WeatherSunnyHigh = "WeatherSunnyHigh", // Weather sunny high icon.
  WeatherSunnyLow = "WeatherSunnyLow", // Weather sunny low icon.
  WeatherThunderstorm = "WeatherThunderstorm", // Weather thunderstorm icon.
  WebAsset = "WebAsset", // Web asset icon.
  Whiteboard = "Whiteboard", // Whiteboard icon.
  Wifi1 = "Wifi1", // Wifi signal with 3 bars icon.
  Wifi2 = "Wifi2", // Wifi signal with 2 bars icon.
  Window = "Window", // Window icon.
  WindowMultiple = "WindowMultiple", // Window multiple icon.
  WindowWrench = "WindowWrench", // Window wrench icon.
  Wrench = "Wrench", // Wrench icon.
  WrenchScrewdriver = "WrenchScrewdriver", // Wrench screwdriver icon.
  Xray = "Xray", // X-ray icon.
  Yoga = "Yoga", // Yoga icon.
}

const useStyles = makeStyles({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundImage: "url('assets/background.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    opacity: 0,
    transition: "opacity 0.5s ease-in",
    position: "relative",
    zIndex: 1,
  },
  fadeIn: {
    opacity: 1,
  },
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    padding: "0",
  },
  loadingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});

const App: React.FC<AppProps> = (props: AppProps) => {
  const styles = useStyles();
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isOfficeInitialized, setIsOfficeInitialized] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashFadeOut, setSplashFadeOut] = useState(false);
  const [fadeInMain, setFadeInMain] = useState(false);
  const [splashFadeIn, setSplashFadeIn] = useState(false);
  const [splashScreenVisible, setSplashScreenVisible] = useState(true);
  const [splashScreenOpacity, setSplashScreenOpacity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Office.onReady(() => {
      setIsOfficeInitialized(true);

      // Fade in splash screen
      setSplashScreenOpacity(1);

      // Start fade out after 2.5 seconds (increased from 2 seconds)
      setTimeout(() => {
        setSplashScreenOpacity(0);

        // Hide splash screen after fade out animation completes
        setTimeout(() => {
          setSplashScreenVisible(false);
          setFadeInMain(true);
        }, 500); // This should match the transition duration in CSS
      }, 2500);
    });
  }, []);

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
    // Here you can add logic to save the API key to local storage or elsewhere
  };

  return (
    <>
      {splashScreenVisible && <SplashScreen opacity={splashScreenOpacity} />}
      <div className={`${styles.root} ${fadeInMain ? styles.fadeIn : ""}`}>
        <Header logo="assets/logo-filled.png" title={props.title} onSettingsClick={() => setShowSettings(true)} />
        <div className={styles.content}>
          <ChatInterface apiKey={apiKey} setIsLoading={setIsLoading} />
        </div>
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
        )}
      </div>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <Spinner size="large" label="Thinking..." />
        </div>
      )}
    </>
  );
};

export default App;
