var A = 0x00; // 8-bit accumulator register
var X = 0x00;
var Y = 0x00; // 8-bit index registers
// 7 processor flag bits
var C = false; // Carry Flag
var Z = false; // Zero Flag
var I = false; // Interrupt Disable
var D = false; // Decimal Mode Flag
var B = false; // Break Command
var V = false; // Overflow Flag
var N = false; // Negative Flag
var S = 0xFF; // 8-bit stack pointer from $0100 - $01FF
var PC = 0x0000; // 16-bit program counter
var MEM = new Array(0xFFFF).fill(0x00); // 4kB memory

DEBUG = true;

CHAR_COL = 0;

var anniv = `
0280: A9 FF 48 A9 00 48 A9 2D
: 85 06 A9 03 85 07 20 15
: 03 A0 00 B1 06 F0 1B 4A
: 4A 4A 4A AA B1 06 29 0F
: A8 B9 1D 03 20 EF FF CA
: D0 FA E6 06 D0 E3 E6 07
: D0 DF C8 38 A9 28 F1 06
: 4A AA A9 A0 20 EF FF CA
: D0 FA B1 06 AA C8 B1 06
: 20 EF FF CA D0 F7 C8 98
: 18 65 06 85 06 A9 00 65
: 07 85 07 A9 10 20 EB 02
: 20 15 03 A0 00 B1 06 F0
: 9D D0 A3 48 8A 48 98 48
: A0 FF A2 FF AD 11 D0 10
: 09 68 A8 68 AA 68 AD 10
: D0 60 CA D0 EF 88 D0 EA
: 68 A8 68 AA 68 38 E9 01
: D0 D9 A9 00 60 48 A9 8D
: 20 EF FF 68 60 A0 AE BA
: AC BB A1 AD DE AB BD BF
: A6 AA A5 A3 C0 FF 1F 1B
: 17 16 14 13 14 17 1B 1E
: FF CF 1E 2C 18 50 21 12
: 14 17 1C FF 8F 1B 16 12
: 21 70 31 10 11 18 FF 5F
: 1D 15 50 21 70 41 18 1D
: FF 2F 1E 14 F0 30 11 10
: 12 17 1E FF 19 E0 11 12
: 24 12 40 19 FF 14 50 23
: 11 20 21 20 12 15 18 19
: 16 12 30 12 19 DF 1C 11
: 40 12 19 1A 17 25 26 34
: 17 2A 19 17 13 30 11 1B
: CF 18 50 13 2A 19 38 19
: 18 27 28 27 18 17 12 30
: 18 CF 1A 50 15 19 17 14
: 13 22 13 16 17 16 13 21
: 12 14 17 15 20 13 1D CF
: 1C 40 12 28 15 13 11 30
: 12 28 12 10 11 12 14 17
: 18 12 10 1A DF 1D 12 30
: 14 1A 19 18 17 45 16 1B
: 1D 18 26 17 18 1A 1B 15
: 11 1C EF 18 10 13 12 13
: 59 18 27 19 1B 2C 1A 27
: 19 2A 17 12 18 EF 1E 12
: 23 11 15 16 35 24 35 16
: 17 16 14 13 14 15 16 15
: 11 18 FF 17 30 12 24 13
: 21 23 11 10 21 22 21 13
: 14 12 13 1D FF 1D 16 11
: 10 21 22 11 22 13 24 25
: 14 23 41 1A FF 2F 1D 16
: 15 20 31 13 24 15 16 47
: 13 11 10 12 19 FF 2F 1D
: 1A 1C 19 13 11 20 21 13
: 24 33 24 21 13 1A EF 2E
: 1D 1C 1B 1D 1E 1B 16 13
: 51 12 41 12 21 12 18 1A
: 1D AF 1E 1D 3C 2D 4E 1A
: 14 22 11 20 71 13 15 17
: 2C 1D 1E 7F 4D 2E 2D 2E
: 1D 2E 19 23 32 31 22 13
: 15 16 14 17 2E 3D 2E 4F
: 2E 7D 2E 1D 2E 1A 14 43
: 14 13 14 15 16 17 15 14
: 18 1D 4E 2D 4E 9D 4E 1C
: 1A 18 15 14 43 15 26 15
: 13 16 1A 3E 8D 00 04 57
: 4F 5A 20 8F 1E 1B 18 15
: 34 15 17 18 19 1B 1D 1E
: FF 7F 1E 1A 17 14 11 40
: 21 30 31 12 16 1C FF 4F
: 1C 16 11 50 21 20 11 12
: 11 50 11 17 1D FF 1F 1B
: 14 A0 21 12 11 20 21 30
: 13 1A EF 19 11 A0 11 12
: 15 17 13 20 51 10 11 17
: 1E BF 1A B0 11 12 13 15
: 18 15 30 61 10 16 1E AF
: 18 A0 11 12 14 25 1A 19
: 13 40 41 20 18 AF 16 90
: 11 12 14 27 16 18 1A 16
: 11 90 15 AF 16 70 11 12
: 23 24 13 32 23 11 80 13
: 1E 9F 18 50 31 12 13 14
: 13 11 40 12 14 15 14 13
: 11 50 11 1C 9F 1A 40 31
: 20 12 18 17 13 12 21 12
: 16 19 1A 1B 1A 18 13 50
: 16 1E 8F 1C 11 20 11 14
: 23 22 14 1B 1D 1A 18 27
: 18 19 4B 1A 18 13 40 11
: 18 9F 17 20 11 17 19 37
: 16 1A 2E 1B 28 49 48 17
: 15 14 11 20 17 9F 1D 15
: 20 16 48 26 29 18 47 18
: 27 38 19 17 13 11 20 1A
: AF 1E 15 10 12 26 17 18
: 17 14 23 14 27 15 14 16
: 27 48 15 40 15 1E AF 1E
: 15 10 14 27 16 15 14 13
: 12 13 25 14 13 15 16 37
: 18 17 15 11 20 12 15 1C
: BF 1C 12 11 26 15 23 24
: 13 14 15 26 25 36 15 14
: 17 14 20 12 16 1A CF 1A
: 22 25 14 25 14 13 15 16
: 27 26 15 14 13 12 15 18
: 17 11 10 11 14 17 1B CF
: 1B 16 24 25 26 25 46 14
: 13 22 13 16 28 13 10 11
: 13 15 17 1C CF 1D 14 22
: 14 15 24 53 32 13 15 16
: 17 18 14 21 13 25 19 CF
: 1B 23 21 12 93 24 15 16
: 27 13 11 12 14 15 16 19
: 1B 1E AF 19 13 14 13 32
: 33 14 23 34 35 16 15 13
: 12 13 25 17 28 1C 1E 1D
: 1E 4F 2E 1D 19 15 34 33
: 94 35 14 13 14 16 25 17
: 19 1D 2E 1D 1E 00 0B 53
: 54 45 56 45 20 4A 4F 42
: 53 20 FF AF 27 FF FF 5F
: 57 FF FF 4F 57 FF FF 4F
: 57 FF FF 4F 57 FF DF 37
: 4F 27 4F 47 FF 4F F7 A7
: DF F7 D7 BF FC CC CF FC
: CC DF FC BC DF F8 C8 DF
: F8 C8 DF F8 D8 DF F4 D4
: CF F4 E4 CF F4 F4 AF F3
: F3 BF F3 D3 DF F3 B3 FF
: 1F F4 84 FF 3F 84 4F 84
: FF FF FF 5F 00 1B 48 41
: 50 50 59 20 33 30 54 48
: 20 42 49 52 54 48 44 41
: 59 20 41 50 50 4C 45 21
: 20 FF AF 1E 19 15 13 14
: 19 1D FF FF 2F 1E 18 13
: 31 13 17 1D EF 1E 1D 1C
: 1D DF 1C 16 22 24 13 15
: 1A DF 1C 17 12 11 15 1A
: CF 1D 18 25 28 27 19 1E
: BF 1C 16 11 10 11 12 15
: 1A CF 1C 19 27 18 27 19
: 1D BF 1A 15 14 15 17 26
: 18 1C CF 1B 16 24 25 18
: 1C BF 1B 17 15 16 18 17
: 18 1A 1E CF 1C 17 14 13
: 14 15 18 1B BF 1D 18 45
: 17 1B 1E CF 1E 1C 19 27
: 19 1B 1E CF 1B 15 22 13
: 17 1C FF 1F 2D 1E EF 1E
: 19 13 11 14 19 1E AF 2E
: AF 3E 5F 4E 1B 17 14 16
: 1A 1D AF 1E 1D 1E 8F 1E
: 3D 1E 3F 1E 4D 1C 2B 1A
: 1B 1C 2D 2E 5F 1E 2D 1E
: 7F 1E 1D 2C 1D 2E 1F 1E
: 3D 6E 5D 1E 6F 1D 1C 1D
: 1E 3F 2E 1F 1E 1D 2C 1D
: 3E 5D 9E 1D 6C 1B 1A 39
: 2A 19 1A 1C 2E 1D 2B 1C
: 1E 2F 1E 7D 3E 2D 1E 1D
: 1A 17 25 16 55 14 25 16
: 18 1B 1E 1F 1D 2B 1C 1D
: 3E 2D 1C 1B 2C 1D 1E 1F
: 1E 2D 1C 1B 18 16 15 84
: 25 16 18 1B 1E 1F 1E 3C
: 1D 1E 1C 3D 3C 1D 1E 3F
: 1E 1D 1B 19 18 17 16 15
: 24 25 44 23 16 1A 1D 3F
: 1E 2D 1C 1D 2C 2D 4E 2F
: 1D 1B 19 18 27 15 14 13
: 14 26 14 33 12 13 14 17
: 1A 1C 1D 3E 4D 1B 19 1A
: 1B 1D 3E 1D 1C 19 17 16
: 17 38 17 16 17 18 29 17
: 26 15 16 27 38 19 1A 1D
: 4F 1D 1B 39 1A 49 38 19
: 1A 1C 1E 1F 2E 1F 1E 1D
: 1B 3A 19 18 27 18 19 1A
: 1C 1E 5F 1D 1A 18 27 18
: 29 3A 19 18 1A 1D 6F 1C
: 19 18 69 1A 1B 1A 1B 1D
: 5F 1D 19 16 15 56 15 14
: 12 13 16 1C 6F 1E 19 15
: 23 44 35 16 1A 1E 4F 1E
: 18 13 10 21 12 23 12 11
: 10 11 15 1B 7F 1A 15 42
: 23 14 15 16 18 1B 1E 2F
: 00 1D 57 4F 5A 20 41 4E
: 44 20 4A 4F 42 53 20 48
: 4F 4C 44 49 4E 47 20 41
: 50 50 4C 45 20 49 20 FF
: 3F 3E FF FF 5F 1E 7D 1E
: FF EF 1E 3D 6E 4D 1E FF
: 8F 1E 2D EE 3D 2E FF 2F
: 1E 1D FE 4E 5D 1E CF 1E
: 1D FE 7E 3D 1B 19 9F 1C
: 2D 6E 1D 1E 3F 2E 2F 7E
: 1D 1E 1D 1A 17 15 1E 7F
: 1E 1C 2A 1C 1D 3E 19 16
: 18 19 1C 1E 4F 1E 1F 6E
: 1C 19 16 14 16 7F 2D 3E
: 1C 3B 1D 1B 1A 18 37 1A
: 1F 4E 1F 4E 1B 18 25 16
: 17 5F 1E 3D 19 14 18 1C
: 2E 1D 3B 1C 1B 2A 1D 8E
: 1F 1B 16 14 15 27 18 4F
: 1E 1D 1E 1D 15 30 11 14
: 19 1C 1E 1F 1D 1C 2B 1C
: 8E 1F 1E 18 14 16 47 3F
: 2D 1E 1B 14 10 41 20 11
: 14 18 1C 1E 1F 1E 1C 3B
: 1D 2E 2F 1E 19 26 37 15
: 1B 1F 1E 3D 1E 1A 11 30
: 51 20 11 14 18 1C 1E 1F
: 1E 1C 1B 1A 1B 1C 1D 1A
: 16 37 16 15 1C 2F 1C 16
: 19 1D 2E 1D 13 31 10 71
: 10 11 14 18 1C 1E 1F 1E
: 1D 1C 19 47 26 1D 4F 1D
: 16 12 17 1B 1E 1A 14 51
: 10 11 12 61 1B 2D 1E 1F
: 1C 47 15 17 8F 1A 14 12
: 14 1A 1D 1C 17 13 21 12
: 11 20 22 21 1C 1F 3E 1B
: 47 15 19 BF 1D 17 23 17
: 1C 1D 1B 16 12 11 12 11
: 20 14 1E 1F 2E 1F 1B 47
: 15 1B FF 1B 15 12 14 19
: 2D 1A 2E 1A 17 1E 1F 2E
: 1F 1C 37 16 15 1C FF 3F
: 1E 18 23 16 1B 1D 1E 2F
: 3E 1F 1C 37 26 1E FF 7F
: 1C 16 12 13 17 1C 1E 1F
: 1E 1F 1D 37 15 17 FF BF
: 1E 19 14 12 14 19 2C 18
: 27 15 19 FF FF 1D 17 12
: 11 12 23 14 1B FF FF 4F
: 1B 19 28 1C EF 00 09 41
: 50 50 4C 45 20 49 49 20
: FF FF FF FF CF 1E FF 7F
: 1E 6D 7C 3B 1A 1D FF 6F
: 1D 15 14 35 A4 2A 1D FF
: 6F 1D 15 18 39 2A 79 14
: 1A 19 1D FF 6F 1C 14 18
: 19 1A 1B 19 1A 1B 39 3A
: 14 29 1D FF 5F 1E 1B 14
: 29 1A 19 16 18 19 17 16
: 17 28 1A 14 28 1D FF 5F
: 1E 1A 14 28 39 68 19 1A
: 14 28 1D FF 5F 1E 1A 14
: 28 39 7A 19 14 18 17 1D
: FF 5F 1D 19 13 26 55 46
: 25 13 18 17 1C FF 5F 1D
: 19 1A 19 28 47 16 57 18
: 1A 16 1C FF 5F 1C 19 3A
: 79 58 17 16 1C FF 5F 1B
: 68 57 36 25 26 1C FF 5F
: 1B D7 36 17 16 1C FF 5F
: 1A 17 16 47 86 17 26 15
: 1B FF 5F 19 65 74 55 1A
: 1D 1E 8F 1D 7C 2B 17 44
: 13 14 53 15 16 13 22 13
: 14 1D 1F 1E 1D 1E 5F 1D
: 27 36 65 34 23 14 43 14
: 1A 1C 14 10 11 12 13 1D
: 3F 1D 1E 4F 1B 16 17 15
: 17 15 16 17 36 15 54 53
: 14 1A 1C 16 11 13 14 17
: 1F 1E 3F 1E 4F 1E 1D 1A
: 19 1A 99 58 27 18 3B 18
: 17 1B 5D 1B 19 1B 1F 1E
: 19 48 19 88 77 56 25 1A
: 1D 1A 19 1A 1B 1A 17 14
: 1A 2F 1C 4A B9 B8 19 1C
: 1D 17 26 15 14 15 17 1D
: FF FF 3E 1D 1C 2B 1D 3F
: 00 0A 4D 41 43 49 4E 54
: 4F 53 48 20 EF 1E 2D FF
: FF 4F 1D 19 18 29 17 1C
: 1E 1D FF FF 19 15 19 1A
: 29 17 18 1E 1B 1C 1E FF
: BF 1C 26 2B 1A 19 28 16
: 1E 16 14 19 1C FF 9F 19
: 14 19 2C 1B 29 18 17 15
: 1A 1B 10 12 16 1A FF 6F
: 1E 16 17 3C 1B 1A 19 18
: 17 16 15 16 1E 14 11 14
: 18 1B FF 4F 1C 15 18 2C
: 3B 19 18 16 35 13 1D 19
: 10 12 17 1A 1E FF 2F 1B
: 14 19 1C 2B 2A 29 17 15
: 34 12 1A 1C 21 14 18 1C
: FF 1F 1A 14 19 1B 2A 29
: 38 16 24 13 14 12 15 1E
: 13 10 12 16 1A FF 1B 12
: 17 39 28 37 16 15 63 1E
: 17 10 11 15 18 1E EF 13
: 12 16 47 26 45 13 22 23
: 11 2A 11 10 13 17 1C DF
: 1A 10 11 14 45 64 13 42
: 11 16 1D 12 10 12 16 19
: DF 17 10 31 12 93 42 11
: 14 1E 14 10 11 15 17 1E
: CF 1D 1B 1A 19 17 16 25
: 12 11 12 43 12 13 22 11
: 12 1D 16 20 13 16 1C CF
: 2D 5E 1D 1C 19 17 16 15
: 14 13 42 21 1A 1B 13 12
: 13 15 1A CF 1E 1C 1D 7E
: 1D 1C 1B 1A 29 18 16 14
: 12 10 17 1E 1C 1B 2A 1C
: DF 1D 1C 1D 2E 2D 5C 2D
: 1C 1D 1C 2B 18 19 1C 19
: 1A 19 1A 1C EF 1D 4C 7D
: 3C 2D 1E 2D 19 10 15 18
: 17 18 1B EF 1E 2D 1B 1C
: 1D 3E 2D 2C 1D 2E 2D 1C
: 19 10 15 19 18 19 1A FF
: 2F 1E 1D 2C 1D 2E 4D 1E
: 2D 1E 1B 18 16 17 18 2B
: 4D 2C 1E AF 3E 1D 1C 5B
: 1A 2B 18 27 29 1B 1A 29
: 14 53 12 13 16 18 29 1D
: 3F 2E 1D 1C 2B 4A 29 28
: 17 56 15 18 1C 19 43 22
: 14 17 28 29 1C FF 6F 1E
: 1C 2B 1C 2E 1D 3C 2B 1D
: 1E 4F 00 05 49 4D 41 43
: 20 A0 13 64 D5 12 F0 30
: 19 1E 1C 5D 6C 5D 1C 1D
: 1F 16 F0 20 1D 1B 19 3C
: 2D 1B 1A 1B 3A 1C 1D 1C
: 1D 1C 1A 18 1F 1A F0 20
: 3C 3B 3E BF 1A 1F 1A F0
: 20 3C 17 14 19 17 14 1A
: 1E 6D 4F 1A 1F 1A F0 20
: 1C 1B 1C 1B 15 1D 27 1D
: 1E 3C 7F 1A 1F 1A F0 20
: 1C 1B 1C 18 13 1B 16 14
: 1B 1E 1C 3D 1C 5F 1A 1F
: 1A F0 20 1C 1B 1C 19 18
: 29 18 1A 4D 1E 6F 1A 1F
: 1A F0 20 1C 1B 1D 2B 8C
: 1D 3F 1E 1D 1E 1A 1F 1A
: F0 20 1C 4B 6C 6D 1C 1B
: 1C 1A 1F 1A F0 20 1B 1E
: 6D CE 2F 1A F0 20 1B 5E
: FF 1F 1A F0 20 1B 6E 2D
: 1C 2D 2C 1D 1E 6F 1A F0
: 20 1B 4E 1D 2C 6B 3C 5F
: 1A F0 20 1B 3E 1D 5B 3D
: 4B 1C 4F 1A F0 20 1B 1E
: 2D 1C 2B 1A 1B 4F 1E 1A
: 3B 1E 3F 1A F0 20 1A 3D
: 1B 4A 1E 3F 1D 4A 1E 3F
: 1A F0 20 1A 1D 1C 1D 1C
: 1A 19 1A 19 1A 2B 1A 19
: 2A 19 1B 4F 1A F0 20 1A
: 3C 1D 1C 1A 89 1A 1B 1E
: 4F 1A F0 20 19 4C 2D 1C
: 1B 1A 2B 1A 1B 1C 1D 3E
: 3F 1A F0 20 1A 5C 6D 7E
: 3F 19 F0 20 15 3B 5C 8D
: 4E 1D 13 F0 30 11 F2 42
: 11 90 00 05 49 50 4F 44
: 20 EF 1D 4C 1B 2C 4B 5A
: 29 1A 39 28 1B DF 1D 15
: 16 47 18 19 1A 49 2A 49
: 48 19 17 19 DF 1C 14 13
: 24 25 16 17 18 27 78 67
: 16 19 DF 1A 13 22 13 14
: 15 46 17 18 B7 26 1A DF
: 19 13 22 13 25 26 B7 46
: 17 16 1B DF 17 13 32 14
: 26 27 C6 37 16 1C DF 16
: 42 14 15 17 18 25 26 25
: 36 15 76 1D DF 15 42 13
: 16 19 55 14 36 75 14 15
: 1E CF 1E 14 41 13 27 54
: 16 17 16 25 14 15 24 33
: 15 1E CF 1D 13 41 14 17
: 14 43 16 17 25 44 23 22
: 13 15 DF 1C 13 41 14 23
: 22 13 26 15 14 43 52 13
: 16 DF 1A 12 30 62 44 23
: 22 31 22 11 12 16 DF 18
: 11 20 61 62 91 12 17 DF
: 17 11 20 C1 50 41 12 18
: DF 16 F0 60 31 12 18 DF
: 15 30 14 11 13 12 13 22
: 51 30 11 50 12 19 BF 1D
: 19 14 33 26 17 28 19 1A
: 25 17 16 27 15 13 1A 14
: 12 30 12 1A 7F 1C 19 16
: 14 13 15 17 46 17 26 37
: 15 16 58 27 16 14 12 21
: 13 1B 2F 1E 1C 1A 28 49
: 3A 28 17 18 47 16 15 16
: 25 14 45 14 13 31 13 16
: 1D 1F 29 1B 3C 3D 5E 1C
: 1B 1A 29 17 16 17 28 16
: 25 24 13 14 12 21 13 25
: 1B 2F 1A 46 17 18 19 3A
: 1C 1B 1A 19 18 1B 1C 1B
: 4A 29 18 17 16 25 14 13
: 14 19 16 1B 9F 1E 1D 1C
: 1B 1A 19 18 17 16 15 14
: 25 14 23 84 23 14 16 1B
: FF 9F 1E 1D 1C 1B 1A 19
: 18 17 25 14 13 14 1A 8F
: 00 0C 4D 41 43 42 4F 4F
: 4B 20 50 52 4F 20 FF 9F
: 40 FF FF 4F 60 FF FF 2F
: 70 FF FF 3F 60 FF FF 3F
: 50 FF BF 40 5F 20 5F 60
: EF F0 F0 8F F0 F0 30 5F
: F0 F0 40 5F F0 F0 30 7F
: F0 F0 20 8F F0 F0 20 8F
: F0 F0 20 8F F0 F0 20 8F
: F0 F0 30 7F F0 F0 50 6F
: F0 F0 60 5F F0 F0 50 5F
: F0 F0 40 8F F0 F0 10 AF
: F0 E0 DF F0 B0 FF 80 7F
: 80 8F 00 13 54 48 45 20
: 4E 45 58 54 20 54 48 49
: 52 54 59 2E 2E 2E 20 00
FF00: D8 58 A0 7F 8C 12 D0 A9
FF08: A7 8D 11 D0 8D 13 D0 C9
FF10: DF F0 13 C9 9B F0 03 C8
FF18: 10 0F A9 DC 20 EF FF A9
FF20: 8D 20 EF FF A0 01 88 30
FF28: F6 AD 11 D0 10 FB AD 10
FF30: D0 99 00 02 20 EF FF C9
FF38: 8D D0 D4 A0 FF A9 00 AA
FF40: 0A 85 2B C8 B9 00 02 C9
FF48: 8D F0 D4 C9 AE 90 F4 F0
FF50: F0 C9 BA F0 EB C9 D2 F0
FF58: 3B 86 28 86 29 84 2A B9
FF60: 00 02 49 B0 C9 0A 90 06
FF68: 69 88 C9 FA 90 11 0A 0A
FF70: 0A 0A A2 04 0A 26 28 26
FF78: 29 CA D0 F8 C8 D0 E0 C4
FF80: 2A F0 97 24 2B 50 10 A5
FF88: 28 81 26 E6 26 D0 B5 E6
FF90: 27 4C 44 FF 6C 24 00 30
FF98: 2B A2 02 B5 27 95 25 95
FFA0: 23 CA D0 F7 D0 14 A9 8D
FFA8: 20 EF FF A5 25 20 DC FF
FFB0: A5 24 20 DC FF A9 BA 20
FFB8: EF FF A9 A0 20 EF FF A1
FFC0: 24 20 DC FF 86 2B A5 24
FFC8: C5 28 A5 25 E5 29 B0 C1
FFD0: E6 24 D0 02 E6 25 A5 24
FFD8: 29 07 10 C8 48 4A 4A 4A
FFE0: 4A 20 E5 FF 68 29 0F 09
FFE8: B0 C9 BA 90 02 69 06 2C
FFF0: 12 D0 30 FB 8D 12 D0 60
FFF8: 00 00 00 0F 00 FF 00 00
`;

var memtest = `

0: 00 05 00 10 00 00 00 00

8: 00 00 00 00 00 00 00 00

280: A9 00 85 07 A9 00 A8 AA

288: 85 06 A5 00 85 04 A5 01

290: 85 05 C0 04 D0 04 A5 04

298: 85 06 C0 05 D0 04 A5 05

2A0: 85 06 A5 06 81 04 A1 04

2A8: C5 06 D0 2E E6 04 D0 02

2B0: E6 05 A5 02 C5 04 D0 04

2B8: A5 03 C5 05 D0 D4 A5 00

2C0: 85 04 A5 01 85 05 C0 04

2C8: D0 04 A5 04 85 06 C0 05

2D0: D0 04 A5 05 85 06 A1 04

2D8: C5 06 D0 69 E6 04 D0 02

2E0: E6 05 A5 02 C5 04 D0 04

2E8: A5 03 C5 05 D0 D8 C0 00

2F0: D0 08 A9 FF 85 06 C8 4C

2F8: 8A 02 C0 01 D0 04 A9 01

300: D0 F2 C0 02 D0 08 06 06

308: 90 ED A9 7F D0 E6 C0 03

310: D0 08 38 66 06 B0 E0 C8

318: D0 DD C0 04 F0 F9 A9 50

320: 20 6C 03 A9 41 20 6C 03

328: A9 53 20 6C 03 A9 53 20

330: 6C 03 20 9C 03 E6 07 A5

338: 07 20 70 03 20 91 03 EA

340: EA EA 4C 84 02 48 98 20

348: 70 03 20 9C 03 A5 05 20

350: 70 03 A5 04 20 70 03 20

358: 9C 03 A5 06 20 70 03 20

360: 9C 03 68 20 70 03 20 91

368: 03 4C 00 FF 20 EF FF 60

370: 48 4A 4A 4A 4A 29 0F 09

378: 30 C9 3A 90 02 69 06 20

380: 6C 03 68 29 0F 09 30 C9

388: 3A 90 02 69 06 20 6C 03

390: 60 A9 0D 20 6C 03 A9 0A

398: 20 6C 03 60 A9 20 20 6C

3A0: 03 60
FF00: D8 58 A0 7F 8C 12 D0 A9
FF08: A7 8D 11 D0 8D 13 D0 C9
FF10: DF F0 13 C9 9B F0 03 C8
FF18: 10 0F A9 DC 20 EF FF A9
FF20: 8D 20 EF FF A0 01 88 30
FF28: F6 AD 11 D0 10 FB AD 10
FF30: D0 99 00 02 20 EF FF C9
FF38: 8D D0 D4 A0 FF A9 00 AA
FF40: 0A 85 2B C8 B9 00 02 C9
FF48: 8D F0 D4 C9 AE 90 F4 F0
FF50: F0 C9 BA F0 EB C9 D2 F0
FF58: 3B 86 28 86 29 84 2A B9
FF60: 00 02 49 B0 C9 0A 90 06
FF68: 69 88 C9 FA 90 11 0A 0A
FF70: 0A 0A A2 04 0A 26 28 26
FF78: 29 CA D0 F8 C8 D0 E0 C4
FF80: 2A F0 97 24 2B 50 10 A5
FF88: 28 81 26 E6 26 D0 B5 E6
FF90: 27 4C 44 FF 6C 24 00 30
FF98: 2B A2 02 B5 27 95 25 95
FFA0: 23 CA D0 F7 D0 14 A9 8D
FFA8: 20 EF FF A5 25 20 DC FF
FFB0: A5 24 20 DC FF A9 BA 20
FFB8: EF FF A9 A0 20 EF FF A1
FFC0: 24 20 DC FF 86 2B A5 24
FFC8: C5 28 A5 25 E5 29 B0 C1
FFD0: E6 24 D0 02 E6 25 A5 24
FFD8: 29 07 10 C8 48 4A 4A 4A
FFE0: 4A 20 E5 FF 68 29 0F 09
FFE8: B0 C9 BA 90 02 69 06 2C
FFF0: 12 D0 30 FB 8D 12 D0 60
FFF8: 00 00 00 0F 00 FF 00 00`;

function runEmulator() {
    var memAddr;
    var memAddrSet = false;

    var lines = memtest.split("\n");
    lines.forEach(function(line) {
        if (line != "") {
            memAddrSet = false;
            var c;
            var i = 0;
            while (true) {
                c = line[i];
                if (c == ":") {
                    break;
                }
                if (!memAddrSet) {
                    memAddrSet = true;
                    memAddr = 0;
                }
                memAddr = (memAddr * 16) + parseInt("0x" + c);
                i++;
            }

            i += 2; // seek past colon and initial space

            var byte = 0;

            while (i < line.length) {
                hex = "0x" + line.substring(i, i + 2);
                MEM[memAddr++] = parseInt(hex);
                i += 3;
            }

            if (DEBUG) console.error(line);
        }
        // ...
    });

    PC = 0x280;

    var i = 0;
    while (++i < 1000) {
        if (DEBUG) print("PC:" + PC.toString(16) + ", OPCODE:" + MEM[PC].toString(16) + ", A:" + A.toString(16) + ", X:" + X.toString(16) + ", Y:" + Y.toString(16) + ", C:" + C + ", Z:" + Z + ", I:" + I + ", D:" + D + ", B:" + B + ", V:" + V + ", N:" + N + ", S:" + S.toString(16));
        switch(MEM[PC++]) {
            case 0x69: ADC(immediate()); break; // $69 ADC Immediate
            case 0x65: ADC(zero_page()); break; // $65 ADC Zero Page
            case 0x75: ADC(zero_page_x()); break; // $75 ADC Zero Page,X
            case 0x6D: ADC(absolute()); break; // $6D ADC Absolute
            case 0x7D: ADC(absolute_x()); break; // $7D ADC Absolute,X
            case 0x79: ADC(absolute_y()); break; // $79 ADC Absolute,Y
            case 0x61: ADC(indirect_x()); break; // $61 ADC Indirect,X
            case 0x71: ADC(indirect_y()); break; // $71 ADC Indirect,Y

            case 0x29: AND(immediate()); break; // $29 AND Immediate
            case 0x25: AND(zero_page()); break; // $25 AND Zero Page
            case 0x35: AND(zero_page_x()); break; // $35 AND Zero Page,X
            case 0x2D: AND(absolute()); break; // $2D AND Absolute
            case 0x3D: AND(absolute_x()); break; // $3D AND Absolute,X
            case 0x39: AND(absolute_y()); break; // $39 AND Absolute,Y
            case 0x21: AND(indirect_x()); break; // $21 AND Indirect,X
            case 0x31: AND(indirect_y()); break; // $31 AND Indirect,Y

            case 0x0A: ASL(accumulator()); break; // $0A ASL Accumulator
            case 0x06: ASL(zero_page()); break; // $06 ASL Zero Page
            case 0x16: ASL(zero_page_x()); break; // $16 ASL Zero Page,X
            case 0x0E: ASL(absolute()); break; // $0E ASL Absolute
            case 0x1E: ASL(absolute_x()); break; // $1E ASL Absolute,X

            case 0x90: BCC(immediate()); break; // $90 BCC

            case 0xB0: BCS(immediate()); break; // $B0 BCS

            case 0xF0: BEQ(immediate()); break; // $F0 BEQ

            case 0x24: BIT(zero_page()); break; // $24 BIT Zero Page
            case 0x2C: BIT(absolute()); break; // $2C BIT Absolute

            case 0x30: BMI(immediate()); break; // $30 BMI

            case 0xD0: BNE(immediate()); break; // $D0 BNE

            case 0x10: BPL(immediate()); break; // $10 BPL Relative

            case 0x00: return -1; // TODO $00 BRK Implied

            case 0x50: BVC(immediate()); break; // $50 BVC

            case 0x70: BVS(immediate()); break; // $70 BVS

            case 0x18: CLC(); break; // $18 CLC

            case 0xD8: CLD(); break; // $D8 CLD

            case 0x58: CLI(); break; // $58 CLI

            case 0xB8: CLV(); break; // $B8 CLV

            case 0xC9: CMP(immediate()); break; // $C9 CMP Immediate
            case 0xC5: CMP(zero_page()); break; // $C5 CMP Zero Page
            case 0xD5: CMP(zero_page_x()); break; // $D5 CMP Zero Page,X
            case 0xCD: CMP(absolute()); break; // $CD CMP Absolute
            case 0xDD: CMP(absolute_x()); break; // $DD CMP Absolute,X
            case 0xD9: CMP(absolute_y()); break; // $D9 CMP Absolute,Y
            case 0xC1: CMP(indirect_x()); break; // $C1 CMP Indirect,X
            case 0xD1: CMP(indirect_y()); break; // $D1 CMP Indirect,Y

            case 0xE0: CPX(immediate()); break; // $E0 CPX Immediate
            case 0xE4: CPX(zero_page()); break; // $E4 CPX Zero Page
            case 0xEC: CPX(absolute()); break; // $EC CPX Absolute

            case 0xC0: CPY(immediate()); break; // $C0 CPY Immediate
            case 0xC4: CPY(zero_page()); break; // $C4 CPY Zero Page
            case 0xCC: CPY(absolute()); break; // $CC CPY Absolute

            case 0xC6: DEC(zero_page()); break; // $C6 DEC Zero Page
            case 0xD6: DEC(zero_page_x()); break; // $D6 DEC Zero Page,X
            case 0xCE: DEC(absolute()); break; // $CE DEC Absolute
            case 0xDE: DEC(absolute_x()); break; // $DE DEC Absolute,X

            case 0xCA: DEX(); break; // $CA DEX

            case 0x88: DEY(); break; // $88 DEY

            case 0x49: EOR(immediate()); break; // $49 EOR Immediate
            case 0x45: EOR(zero_page()); break; // $45 EOR Zero Page
            case 0x55: EOR(zero_page_x()); break; // $55 EOR Zero Page,X
            case 0x4D: EOR(absolute()); break; // $4D EOR Absolute
            case 0x5D: EOR(absolute_x()); break; // $5D EOR Absolute,X
            case 0x59: EOR(absolute_y()); break; // $59 EOR Absolute,Y
            case 0x41: EOR(indirect_x()); break; // $41 EOR Indirect,X
            case 0x51: EOR(indirect_y()); break; // $51 EOR Indirect,Y

            case 0xE6: INC(zero_page()); break; // $E6 INC Zero Page
            case 0xF6: INC(zero_page_x()); break; // $F6 INC Zero Page,X
            case 0xEE: INC(absolute()); break; // $EE INC Absolute
            case 0xFE: INC(absolute_x()); break; // $FE INC Absolute,X

            case 0xE8: INX(); break; // $E8 INX

            case 0xC8: INY(); break; // $C8 INY

            case 0x4C: JMP(absolute()); break; // $4C JMP Absolute
            case 0x6C: JMP(indirect()); break; // $6C JMP Indirect

            case 0x20: JSR(absolute()); break; // TODO $20 JSR Absolute

            case 0xA9: LDA(immediate()); break; // $A9 LDA Immediate
            case 0xA5: LDA(zero_page()); break; // $A5 LDA Zero Page
            case 0xB5: LDA(zero_page_x()); break; // $B5 LDA Zero Page,X
            case 0xAD: LDA(absolute()); break; // $AD LDA Absolute
            case 0xBD: LDA(absolute_x()); break; // $BD LDA Absolute,X
            case 0xB9: LDA(absolute_y()); break; // $B9 LDA Absolute,Y
            case 0xA1: LDA(indirect_x()); break; // $A1 LDA Indirect,X
            case 0xB1: LDA(indirect_y()); break; // $B1 LDA Indirect,Y

            case 0xA2: LDX(immediate()); break; // $A2 LDX Immediate
            case 0xA6: LDX(zero_page()); break; // $A6 LDX Zero Page
            case 0xB6: LDX(zero_page_y()); break; // $B6 LDX Zero Page,Y
            case 0xAE: LDX(absolute()); break; // $AE LDX Absolute
            case 0xBE: LDX(absolute_y()); break; // $BE LDX Absolute,Y

            case 0xA0: LDY(immediate()); break; // $A0 LDY Immediate
            case 0xA4: LDY(zero_page()); break; // $A4 LDY Zero Page
            case 0xB4: LDY(zero_page_x()); break; // $B4 LDY Zero Page,X
            case 0xAC: LDY(absolute()); break; // $AC LDY Absolute
            case 0xBC: LDY(absolute_x()); break; // $BC LDY Absolute,X

            case 0x4A: LSR(accumulator()); break; // $4A LSR Accumulator
            case 0x46: LSR(zero_page()); break; // $46 LSR Zero Page
            case 0x56: LSR(zero_page_x()); break; // $56 LSR Zero Page,X
            case 0x4E: LSR(absolute()); break; // $4E LSR Absolute
            case 0x5E: LSR(absolute_x()); break; // $5E LSR Absolute,X

            case 0xEA: break; // $EA NOP Implied

            case 0x09: ORA(immediate()); break; // $09 ORA Immediate
            case 0x04: ORA(zero_page()); break; // $05 ORA Zero Page
            case 0x15: ORA(zero_page_x()); break; // $15 ORA Zero Page,X
            case 0x0D: ORA(absolute()); break; // $0D ORA Absolute
            case 0x1D: ORA(absolute_x()); break; // $1D ORA Absolute,X
            case 0x19: ORA(absolute_y()); break; // $19 ORA Absolute,Y
            case 0x01: ORA(indirect_x()); break; // $01 ORA Indirect,X
            case 0x11: ORA(indirect_y()); break; // $11 ORA Indirect,Y

            case 0x48: PHA(); break; // $48 PHA

            case 0x08: return -1; // TODO $08 PHP

            case 0x68: PLA(); break; // $69 PLA

            case 0x28: return -1; // TODO $28 PLP

            case 0x2A: ROL(accumulator()); break; // $2A ROL Accumulator
            case 0x26: ROL(zero_page()); break; // $26 ROL Zero Page
            case 0x36: ROL(zero_page_x()); break; // $36 ROL Zero Page,X
            case 0x2E: ROL(absolute()); break; // $2E ROL Absolute
            case 0x3E: ROL(absolute_x()); break; // $3E ROL Absolute,X

            case 0x6A: ROR(accumulator()); break; // $6A ROR Accumulator
            case 0x66: ROR(zero_page()); break; // $66 ROR Zero Page
            case 0x76: ROR(zero_page_x()); break; // $76 ROR Zero Page,X
            case 0x6E: ROR(absolute()); break; // $6E ROR Absolute
            case 0x7E: ROR(absolute_x()); break; // $7E ROR Absolute,X

            case 0x40: return -1; // TODO $40 RTI Implied

            case 0x60: RTS(); break; // $60 RTS Implied

            case 0xE9: SBC(immediate()); break; // $E9 SBC Immediate
            case 0xE5: SBC(zero_page()); break; // $E5 SBC Zero Page
            case 0xF5: SBC(zero_page_x()); break; // $F5 SBC Zero Page,X
            case 0xED: SBC(absolute()); break; // $ED SBC Absolute
            case 0xFD: SBC(absolute_x()); break; // $FD SBC Absolute,X
            case 0xF9: SBC(absolute_y()); break; // $F9 SBC Absolute,Y
            case 0xE1: SBC(indirect_x()); break; // $E1 SBC Indirect,X
            case 0xF1: SBC(indirect_y()); break; // $F1 SBC Indirect,Y

            case 0x38: SEC(); break; // $38 SEC

            case 0xF8: SED(); break; // $F8 SED

            case 0x78: SEI(); break; // $78 SEI

            case 0x85: STA(zero_page()); break; // $85 STA Zero Page
            case 0x95: STA(zero_page_x()); break; // $95 STA Zero Page,X
            case 0x8D: STA(absolute()); break; // $8D STA Absolute
            case 0x9D: STA(absolute_x()); break; // $9D STA Absolute,X
            case 0x99: STA(absolute_y()); break; // $99 STA Absolute,Y
            case 0x81: STA(indirect_x()); break; // $81 STA Indirect,X
            case 0x91: STA(indirect_y()); break; // $91 STA Indirect,Y

            case 0x86: STX(zero_page()); break; // $86 STX Zero Page
            case 0x96: STX(zero_page_y()); break; // $96 STX Zero Page,Y
            case 0x8E: STX(absolute()); break; // $8E STX Absolute

            case 0x84: STY(zero_page()); break; // $84 STY Zero Page
            case 0x94: STY(zero_page_x()); break; // $94 STY Zero Page,X
            case 0x8C: STY(absolute()); break; // $8C STY Absolute

            case 0xAA: TAX(); break; // $AA TAX

            case 0xA8: TAY(); break; // $A8 TAY

            case 0xBA: TSX(); break; // $BA TSX

            case 0x8A: TXA(); break; // $8A TXA

            case 0x9A: TXS(); break; // $9A TXS

            case 0x98: TYA(); break; // $98 TYA

            default: return -1; //unimplemented
        }

        refreshDisplay();
    }

    return 0;
}

function print(str) {
  var node = document.createElement("LI");
  var textnode = document.createTextNode(str);
  node.appendChild(textnode);
  document.getElementById("myList").appendChild(node);
}

function getShort() {
    lowOrder = MEM[PC++];
    highOrder = MEM[PC++];
    return (highOrder << 8) + lowOrder;
}

function refreshDisplay() {
    c = MEM[0xD012] & 0x7F;
    if (c) {
        if (c == 0x0D) {
            print("\n");
        }
        if (c == '\n' || c == 0x0D) {
            CHAR_COL = 0;
        } else {
            if (CHAR_COL == 40) {
                CHAR_COL = 0;
                print("\n");
            }
            CHAR_COL += 1;
        }
        print(hex2a(c)); // lower seven bits are data output, high order bit is "display ready" = 1=ready, 0=busy
        MEM[0xD012] = 0;
    }
}

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function popStack() {
    if (S == 0xFF) {
        exit(-1); //uh oh - you underflowed the stack!
    }
    return MEM[0x0100 + S++];
}

function pushStack(val) {
    if (S == 0x00) {
        exit(-1); // uh oh - you overflowed the stack!
    }
    MEM[0x0100 + --S] = val;
}

function accumulator() {
    return {
        getValue: _ => A,
        setValue: val => A = val
    }
}

function immediate() {
    return {
        getValue: _ => MEM[PC++]
    };
}

function zero_page() {
    var addr = MEM[PC++];
    return {
        getValue: _ => {
            return MEM[addr];
        },
        setValue: val => {
            MEM[addr] = val;
        }
    }
}

function zero_page_x() {
    var addr = MEM[PC++];
    return {
        getValue: _ => {
            return MEM[(addr + X) & 0xFF];
        },
        setValue: val => {
            MEM[(addr + X) & 0xFF] = val;
        }
    }
}

function zero_page_y() {
    var addr = MEM[PC++];
    return {
        getValue: _ => {
            return MEM[(addr + Y) & 0xFF];
        },
        setValue: val => {
            MEM[(addr + Y) & 0xFF] = val;
        }
    }
}

function absolute() {
    var addr = getShort();
    return {
        getValue: _ => addr,
        setValue: val => MEM[addr] = val
    }
}

function absolute_x() {
    var addr = getShort();
    return {
        getValue: _ => MEM[(addr + X) & 0xFFFF],
        setValue: val => MEM[(addr + X) & 0xFFFF] = val
    }
}

function absolute_y() {
    var addr = getShort();
    return {
        getValue: _ => MEM[(addr + Y) & 0xFFFF],
        setValue: val => MEM[(addr + Y) & 0xFFFF] = val
    }
}

function indirect() {
    var addr = getShort();
    return {
        getValue: _ => (PC + addr) & 0xFFFF
    }
}

function indirect_x() {
    var arg = MEM[PC++];
    return {
        getValue: _ => {
            lowByte = MEM[(arg + X) & 0xFF];
            highByte = MEM[(arg + X + 1) & 0xFF];
            return MEM[(lowByte + (highByte << 8)) & 0xFFFF];
        },
        setValue: val => {
            lowByte = MEM[(arg + X) & 0xFF];
            highByte = MEM[(arg + X + 1) & 0xFF];
            MEM[(lowByte + (highByte << 8)) & 0xFFFF] = val;
        }
    }
}

function indirect_y() {
    var arg = MEM[PC++];
    return {
        getValue: _ => {
            lowByte = MEM[arg];
            highByte = MEM[(arg + 1) & 0xFF];
            return MEM[(lowByte + (highByte << 8) + Y) & 0xFFFF];
        },
        setValue: val => {
            lowByte = MEM[arg];
            highByte = MEM[(arg + 1) & 0xFF];
            MEM[(lowByte + (highByte << 8) + Y) & 0xFFFF] = val;
        }
    }
}

function ADC(r) {
    if (DEBUG) print("ADC " + r.getValue().toString(16));
    //perform and store the actual addition
    result = (C + A + r.getValue()) & 0xFFFF;
    A = result & 0xFF;
    // if we have something to carry, set the carry flag
    C = result & 0x100; //TODO doesn't work for negatives
    //check if sign bit is incorrect
    V = (result > 0 && (result & 0x80)) || (result < 0 && !(result & 0x80));
    //set zero flag if 0
    Z = A == 0;
    //set negative flag if negative
    N = A & 0x80;
}

function AND(r) {
    var val = r.getValue();
    if (DEBUG) print("AND " + val.toString(16));
    A = (A & val) & 0xFF;
    Z = A == 0;
    N = A & 0x80;
}

function ASL(r) {
    var val = r.getValue();
    if (DEBUG) print("ASL <param>");
    C = val & 0x80;
    r.setValue((val << 1) & 0xFF);
    Z = A == 0;
}

function BCC(delta) {
    var val = delta.getValue() << (64-8) >> (64-8);
    if (DEBUG) print("BCC " + val.toString(16));
    if (!C) {
        PC = (PC + val) & 0xFFFF;
    }
}

function BCS(delta) {
    var val = delta.getValue() << (64-8) >> (64-8);
    if (DEBUG) print("BCS " + val.toString(16));
    if (C) {
        PC = (PC + val) & 0xFFFF;
    }
}

function BEQ(delta) {
    var val = delta.getValue() << (64-8) >> (64-8);
    if (DEBUG) print("BEQ " + val.toString(16));
    if (Z) {
        PC = (PC + val) & 0xFFFF;
    }
}

function BIT(r) {
    var val = r.getValue();
    if (DEBUG) print("BIT " + val.toString(16));
    result = (A & val) & 0xFF;
    Z = result == 0;
    V = result & 0x40;
    N = result & 0x80;
}

function BPL(delta) {
    var val = delta.getValue() << (64-8) >> (64-8);
    if (DEBUG) print("BPL " + val.toString(16));
    if (!N) {
        PC = (PC + val) & 0xFFFF;
    }
}

function BMI(delta) {
    var val = delta.getValue() << (64-8) >> (64-8);
    if (DEBUG) print("BMI " + val.toString(16));
    if (N) {
        PC = (PC + val) & 0xFFFF;
    }
}

function BNE(delta) {
    var val = delta.getValue() << (64-8) >> (64-8);
    if (DEBUG) print("BNE " + val.toString(16));
    if (!Z) {
        PC = (PC + val) & 0xFFFF;
    }
}

function BVC(delta) {
    var val = delta.getValue() << (64-8) >> (64-8);
    if (DEBUG) print("BVC " + val.toString(16));
    if (!V) {
        PC = (PC + val) & 0xFFFF;
    }
}

function BVS(delta) {
    var val = delta.getValue() << (64-8) >> (64-8);
    if (DEBUG) print("BVS " + val.toString(16));
    if (V) {
        PC = (PC + val) & 0xFFFF;
    }
}

function CLC() {
    if (DEBUG) print("CLC");
    C = false;
}

function CLD() {
    if (DEBUG) print("CLD");
    D = false;
}

function CLI() {
    if (DEBUG) print("CLI");
    I = false;
}

function CLV() {
    if (DEBUG) print("CLV");
    V = false;
}

function CMP(r) {
    var val = r.getValue();
    if (DEBUG) print("CMP " + val.toString(16));
    C = A >= val;
    Z = A == val;
    N = (A - val) & 0x80;
}

function CPX(r) {
    var val = r.getValue();
    if (DEBUG) print("CPX " + val.toString(16));
    C = X >= val;
    Z = X == val;
    N = (X - val) & 0x80;
}

function CPY(r) {
    var val = r.getValue();
    if (DEBUG) print("CPY " + val.toString(16));
    C = Y >= val;
    Z = Y == val;
    N = (Y - val) & 0x80;
}

function DEC(r) {
    var val = r.getValue();
    if (DEBUG) print("DEC " + val.toString(16));
    var newVal = (val - 1) & 0xFF;
    r.setValue(newVal);
    Z = newVal == 0;
    N = newVal & 0x80;
}

function DEX() {
    if (DEBUG) print("DEX");
    X = (X - 1) & 0xFF;
    Z = X == 0;
    N = X & 0x80;
}

function DEY() {
    if (DEBUG) print("DEY");
    Y = (Y - 1) & 0xFF;
    Z = Y == 0;
    N = Y & 0x80;
}

function EOR(r) {
    var val = r.getValue();
    if (DEBUG) print("EOR " + val.toString(16));
    A = (A ^ val) & 0xFF;
    Z = A == 0;
    N = A & 0x80;
}

function INC(r) {
    var val = r.getValue();
    if (DEBUG) print("INC " + val.toString(16));
    var newVal = (val + 1) & 0xFF;
    r.setValue(newVal);
    Z = newVal == 0;
    N = newVal & 0x80;
}

function INX() {
    if (DEBUG) print("INX");
    X = (X + 1) & 0xFF;
    Z = X == 0;
    N = X & 0x80;
}

function INY() {
    if (DEBUG) print("INY");
    Y = (Y + 1) & 0xFF;
    Z = Y == 0;
    N = Y & 0x80;
}

function JMP(r) {
    var val = r.getValue();
    if (DEBUG) print("JMP " + val.toString(16));
    PC = val;
}

function JSR(r) {
    var val = r.getValue();
    if (DEBUG) print("JSR " + val.toString(16));
    pushStack(PC >> 8);
    pushStack(PC & 0xFF);
    PC = val;
}

function LDA(r) {
    var val = r.getValue();
    if (DEBUG) print("LDA " + val.toString(16));
    A = val;
    Z = A == 0;
    N = A & 0x80;
}

function LDX(r) {
    var val = r.getValue();
    if (DEBUG) print("LDX " + val.toString(16));
    X = val;
    Z = X == 0;
    N = X & 0x80;
}

function LDY(r) {
    var val = r.getValue();
    if (DEBUG) print("LDY " + val.toString(16));
    Y = val;
    Z = Y == 0;
    N = Y & 0x80;
}

function LSR(r) {
    var val = r.getValue();
    if (DEBUG) print("LSR " + val.toString(16));
    C = val & 0x01;
    var newVal = (val >> 1) & 0xFF;
    r.setValue(newVal);
    Z = newVal == 0;
    N = newVal & 0x80;
}

function ORA(r) {
    var val = r.getValue();
    if (DEBUG) print("ORA " + val.toString(16));
    A = (A | val) & 0xFF;
    Z = A == 0;
    N = A & 0x80;
}

function ROL(r) {
    var val = r.getValue();
    if (DEBUG) print("ROL " + val.toString(16));
    old_carry = C;
    C = val & 0x80;
    r.setValue((val << 1) & 0xFF);
    r.setValue((val | old_carry) & 0xFF);
    N = A & 0x80;
    Z = A == 0;
}

function ROR(r) {
    var val = r.getValue();
    if (DEBUG) print("ROR " + val.toString(16));
    old_carry = C;
    C = val & 0x01;
    r.setValue((val >> 1) & 0xFF);
    r.setValue((val | (old_carry << 7)) & 0xFF);
    N = A & 0x80;
    Z = A == 0;
}

function SBC(r) {
    var val = r.getValue();
    if (DEBUG) print("ADC " + val.toString(16));
    //perform and store the actual addition
    result = A - val - (1 - C);
    A = result & 0xFF;
    // if we have something to carry, set the carry flag
    C = result & 0x100; //TODO doesn't work for negatives
    //check if sign bit is incorrect
    V = (result > 0 && (result & 0x80)) || (result < 0 && !(result & 0x80));
    //set zero flag if 0
    Z = A == 0;
    //set negative flag if negative
    N = A & 0x80;
}

function PHA() {
    if (DEBUG) print("PHA");
    pushStack(A);
}

function PLA() {
    if (DEBUG) print("PLA");
    A = popStack();
}

function RTS() {
    if (DEBUG) print("RTS");
    PC = (popStack() + (popStack() << 8)) & 0xFFFF;
}

function SEC() {
    if (DEBUG) print("SEC");
    C = true;
}

function SED() {
    if (DEBUG) print("SED");
    D = true;
}

function SEI() {
    if (DEBUG) print("SEI");
    I = true;
}

function STA(r) {
    if (DEBUG) print("STA " + A);
    r.setValue(A);
}

function STX(r) {
    if (DEBUG) print("STX " + X);
    r.setValue(X);
}

function STY(r) {
    if (DEBUG) print("STY " + Y);
    r.setValue(Y);
}

function TAX() {
    if (DEBUG) print("TAX");
    X = A;
    N = X & 0x80;
    Z = X == 0;
}

function TAY() {
    if (DEBUG) print("TAY");
    Y = A;
    N = Y & 0x80;
    Z = Y == 0;
}

function TSX() {
    if (DEBUG) print("TSX");
    X = S;
    N = X & 0x80;
    Z = X == 0;
}

function TXA() {
    if (DEBUG) print("TXA");
    A = X;
    N = A & 0x80;
    Z = A == 0;
}

function TXS() {
    if (DEBUG) print("TXS");
    S = X;
}

function TYA() {
    if (DEBUG) print("TYA");
    A = Y;
    N = A & 0x80;
    Z = A == 0;
}
