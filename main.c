#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "stdbool.h"

char getVal(char c);
unsigned short getShort();

//implicit
unsigned char* accumulator_ptr();
unsigned char immediate();
unsigned char zero_page();
unsigned char* zero_page_ptr();
unsigned char zero_page_x();
unsigned char* zero_page_x_ptr();
unsigned char zero_page_y();
unsigned char* zero_page_y_ptr();
//relative
unsigned short absolute();
unsigned char* absolute_ptr();
unsigned char absolute_x();
unsigned char* absolute_x_ptr();
unsigned char absolute_y();
unsigned char* absolute_y_ptr();
unsigned char indirect();
unsigned char indirect_x();
unsigned char* indirect_x_ptr();
unsigned char indirect_y();
unsigned char* indirect_y_ptr();

void AND(unsigned char r);
void ASL(unsigned char *r);
void BCC(char delta);
void BCS(char delta);
void BEQ(char delta);
void BIT(unsigned char r);
void BPL(char delta);
void BMI(char delta);
void BNE(char delta);
void BVC(char delta);
void BVS(char delta);
void CLC();
void CLD();
void CLI();
void CLV();
void CMP(unsigned char r);
void CPX(unsigned char r);
void CPY(unsigned char r);
void DEC(unsigned char* r);
void DEX();
void DEY();
void EOR(unsigned char r);
void INC(unsigned char* r);
void INX();
void INY();
void JMP(unsigned short r);
void LDA(unsigned char r);
void LDX(unsigned char r);
void LDY(unsigned char r);
void LSR(unsigned char* r);
void ORA(unsigned char r);
void ROL(unsigned char* r);
void ROR(unsigned char* r);
void SEC();
void SED();
void SEI();
void STA(unsigned char* r);
void STX(unsigned char* r);
void STY(unsigned char* r);
void TAX();
void TAY();
void TSX();
void TXA();
void TXS();
void TYA();

unsigned char A = 0; // 8-bit accumulator register
unsigned char X = 0, Y = 0; // 8-bit index registers
// 7 processor flag bits
bool C = false; // Carry Flag
bool Z = false; // Zero Flag
bool I = false; // Interrupt Disable
bool D = false; // Decimal Mode Flag
bool B = false; // Break Command
bool V = false; // Overflow Flag
bool N = false; // Negative Flag
unsigned char S; // 8-bit stack pointer
unsigned short PC; // 16-bit program counter
unsigned char MEM[4 * 1024]; // 4kB memory


int main(int argc, char** argv) {
    FILE *fp;
    fp = fopen("6502_memtest.txt", "rb");

    char line[100];

    while (fgets(line, 100, fp) != NULL) {
        if (strncmp(line, "\n", 1) == 0) {
            continue;
        }

        char c;
        int i = 0;
        unsigned short memAddr = 0;
        while (true) {
            c = line[i];
            if (c == ':') {
                break;
            }
            memAddr = (memAddr * 16) + getVal(c);
            i++;
        }

        i += 2; // seek past colon and initial space

        unsigned char byte = 0;
        while (true) {
            c = line[i];
            if (c == '\n') {
                MEM[memAddr++] = byte;
                //printf("MEM[%02x] = 0x%02x\n", memAddr, byte);
                //memAddr++;
                break;
            }
            if (c == ' ') {
                MEM[memAddr++] = byte;
                //printf("MEM[%02x] = 0x%02x\n", memAddr, byte);
                byte = 0;
                //memAddr++;
                i++;
                continue;
            }
            //printf("    getVal(c) = %d\n", getVal(c));
            byte = (byte * 16) + getVal(c);
            i++;
        }

        printf("%s\n", line);
    }

    PC = 0x280;

    while (true) {
        printf("PC:%02X, OPCODE:%02X, A:%02X, X:%02X, Y:%02X, C:%d, Z:%d, I:%d, D:%d, B:%d, V:%d, N:%d, S:%02X\n", PC, MEM[PC], A, X, Y, C, Z, I, D, B, V, N, S);
        switch(MEM[PC]) {
            case 0x69: PC += 2; return -1; // TODO $69 ADC Immediate
            case 0x65: PC += 2; return -1; // TODO $65 ADC Zero Page
            case 0x75: PC += 2; return -1; // TODO $75 ADC Zero Page,X
            case 0x6D: PC += 3; return -1; // TODO $6D ADC Absolute
            case 0x7D: PC += 3; return -1; // TODO $7D ADC Absolute,X
            case 0x79: PC += 3; return -1; // TODO $79 ADC Absolute,Y
            case 0x61: PC += 2; return -1; // TODO $61 ADC Indirect,X
            case 0x71: PC += 2; return -1; // TODO $71 ADC Indirect,Y

            case 0x29: AND(immediate()); PC += 2; break; // $29 AND Immediate
            case 0x25: AND(zero_page()); PC += 2; break; // $25 AND Zero Page
            case 0x35: AND(zero_page_x()); PC += 2; break; // $35 AND Zero Page,X
            case 0x2D: AND(absolute()); PC += 3; break; // $2D AND Absolute
            case 0x3D: AND(absolute_x()); PC += 3; break; // $3D AND Absolute,X
            case 0x39: AND(absolute_y()); PC += 3; break; // $39 AND Absolute,Y
            case 0x21: AND(indirect_x()); PC += 2; break; // $21 AND Indirect,X
            case 0x31: AND(indirect_y()); PC += 2; break; // $31 AND Indirect,Y

            case 0x0A: ASL(accumulator_ptr()); PC += 1; break; // $0A ASL Accumulator
            case 0x06: ASL(zero_page_ptr()); PC += 2; break; // $06 ASL Zero Page
            case 0x16: ASL(zero_page_x_ptr()); PC += 2; break; // $16 ASL Zero Page,X
            case 0x0E: ASL(absolute_ptr()); PC += 3; break; // $0E ASL Absolute
            case 0x1E: ASL(absolute_x_ptr()); PC += 3; break; // $1E ASL Absolute,X

            case 0x90: BCC(MEM[PC + 1]); PC += 2; break; // $90 BCC

            case 0xB0: BCS(MEM[PC + 1]); PC += 2; break; // $B0 BCS

            case 0xF0: BEQ(MEM[PC + 1]); PC += 2; break; // $F0 BEQ

            case 0x24: BIT(zero_page()); PC += 2; break; // $24 BIT Zero Page
            case 0x2C: BIT(absolute()); PC += 3; break; // $2C BIT Absolute

            case 0x30: BMI(MEM[PC + 1]); PC += 2; break; // $30 BMI

            case 0xD0: BNE(MEM[PC + 1]); PC += 2; break; // $D0 BNE

            case 0x10: BPL(MEM[PC + 1]); PC += 2; break; // $10 BPL Relative

            case 0x00: PC += 1; return -1; // TODO $00 BRK Implied

            case 0x50: BVC(MEM[PC + 1]); PC += 2; break; // $50 BVC

            case 0x70: BVS(MEM[PC + 1]); PC += 2; break; // $70 BVS

            case 0x18: CLC(); PC += 1; break; // $18 CLC

            case 0xD8: CLD(); PC += 1; break; // $D8 CLD

            case 0x58: CLI(); PC += 1; break; // $58 CLI

            case 0xB8: CLV(); PC += 1; break; // $B8 CLV

            case 0xC9: CMP(immediate()); PC += 2; break; // $C9 CMP Immediate
            case 0xC5: CMP(zero_page()); PC += 2; break; // $C5 CMP Zero Page
            case 0xD5: CMP(zero_page_x()); PC += 2; break; // $D5 CMP Zero Page,X
            case 0xCD: CMP(absolute()); break; // $CD CMP Absolute
            case 0xDD: CMP(absolute_x()); break; // $DD CMP Absolute,X
            case 0xD9: CMP(absolute_y()); break; // $D9 CMP Absolute,Y
            case 0xC1: CMP(indirect_x()); PC += 2; break; // $C1 CMP Indirect,X
            case 0xD1: CMP(indirect_y()); PC += 2; break; // $D1 CMP Indirect,Y

            case 0xE0: CPX(immediate()); PC += 2; break; // $E0 CPX Immediate
            case 0xE4: CPX(zero_page()); PC += 2; break; // $E4 CPX Zero Page
            case 0xEC: CPX(absolute()); break; // $EC CPX Absolute

            case 0xC0: CPY(immediate()); PC += 2; break; // $C0 CPY Immediate
            case 0xC4: CPY(zero_page()); PC += 2; break; // $C4 CPY Zero Page
            case 0xCC: CPY(absolute()); break; // $CC CPY Absolute

            case 0xC6: DEC(zero_page_ptr()); PC += 2; break; // $C6 DEC Zero Page
            case 0xD6: DEC(zero_page_x_ptr()); PC += 2; break; // $D6 DEC Zero Page,X
            case 0xCE: DEC(absolute_ptr()); break; // $CE DEC Absolute
            case 0xDE: DEC(absolute_x_ptr()); break; // $DE DEC Absolute,X

            case 0xCA: DEX(); break; // $CA DEX

            case 0x88: DEY(); break; // $88 DEY

            case 0x49: EOR(immediate()); PC += 2; break; // $49 EOR Immediate
            case 0x45: EOR(zero_page()); PC += 2; break; // $45 EOR Zero Page
            case 0x55: EOR(zero_page_x()); PC += 2; break; // $55 EOR Zero Page,X
            case 0x4D: EOR(absolute()); break; // $4D EOR Absolute
            case 0x5D: EOR(absolute_x()); break; // $5D EOR Absolute,X
            case 0x59: EOR(absolute_y()); break; // $59 EOR Absolute,Y
            case 0x41: EOR(indirect_x()); PC += 2; break; // $41 EOR Indirect,X
            case 0x51: EOR(indirect_y()); PC += 2; break; // $51 EOR Indirect,Y

            case 0xE6: INC(zero_page_ptr()); PC += 2; break; // $E6 INC Zero Page
            case 0xF6: INC(zero_page_x_ptr()); PC += 2; break; // $F6 INC Zero Page,X
            case 0xEE: INC(absolute_ptr()); PC += 3; break; // $EE INC Absolute
            case 0xFE: INC(absolute_x_ptr()); PC += 3; break; // $FE INC Absolute,X

            case 0xE8: INX(); PC += 1; break; // $E8 INX

            case 0xC8: INY(); PC += 1; break; // $C8 INY

            case 0x4C: JMP(absolute()); break; // $4C JMP Absolute
            case 0x6C: JMP(indirect()); break; // $6C JMP Indirect

            case 0x20: PC += 3; return -1; // TODO $20 JSR Absolute

            case 0xA9: LDA(immediate()); PC += 2; break; // $A9 LDA Immediate
            case 0xA5: LDA(zero_page()); PC += 2; break; // $A5 LDA Zero Page
            case 0xB5: LDA(zero_page_x()); PC += 2; break; // $B5 LDA Zero Page,X
            case 0xAD: LDA(absolute()); PC += 3; break; // $AD LDA Absolute
            case 0xBD: LDA(absolute_x()); PC += 3; break; // $BD LDA Absolute,X
            case 0xB9: LDA(absolute_y()); PC += 3; break; // $B9 LDA Absolute,Y
            case 0xA1: LDA(indirect_x()); PC += 2; break; // $A1 LDA Indirect,X
            case 0xB1: LDA(indirect_y()); PC += 2; break; // $B1 LDA Indirect,Y

            case 0xA2: LDX(immediate()); PC += 2; break; // $A2 LDX Immediate
            case 0xA6: LDX(zero_page()); PC += 2; break; // $A6 LDX Zero Page
            case 0xB6: LDX(zero_page_y()); PC += 2; break; // $B6 LDX Zero Page,Y
            case 0xAE: LDX(absolute()); PC += 3; break; // $AE LDX Absolute
            case 0xBE: LDX(absolute_y()); PC += 3; break; // $BE LDX Absolute,Y

            case 0xA0: LDY(immediate()); PC += 2; break; // $A0 LDY Immediate
            case 0xA4: LDY(zero_page()); PC += 2; break; // $A4 LDY Zero Page
            case 0xB4: LDY(zero_page_x()); PC += 2; break; // $B4 LDY Zero Page,X
            case 0xAC: LDY(absolute()); PC += 3; break; // $AC LDY Absolute
            case 0xBC: LDY(absolute_x()); PC += 3; break; // $BC LDY Absolute,X

            case 0x4A: LSR(accumulator_ptr()); PC += 1; break; // $4A LSR Accumulator
            case 0x46: LSR(zero_page_ptr()); PC += 2; break; // $46 LSR Zero Page
            case 0x56: LSR(zero_page_x_ptr()); PC += 2; break; // $56 LSR Zero Page,X
            case 0x4E: LSR(absolute_ptr()); PC += 3; break; // $4E LSR Absolute
            case 0x5E: LSR(absolute_x_ptr()); PC += 3; break; // $5E LSR Absolute,X

            case 0xEA: PC += 1; break; // $EA NOP Implied

            case 0x09: ORA(immediate()); PC += 2; break; // $09 ORA Immediate
            case 0x04: ORA(zero_page()); PC += 2; break; // $05 ORA Zero Page
            case 0x15: ORA(zero_page_x()); PC += 2; break; // $15 ORA Zero Page,X
            case 0x0D: ORA(absolute()); PC += 3; break; // $0D ORA Absolute
            case 0x1D: ORA(absolute_x()); PC += 3; break; // $1D ORA Absolute,X
            case 0x19: ORA(absolute_y()); PC += 3; break; // $19 ORA Absolute,Y
            case 0x01: ORA(indirect_x()); PC += 2; break; // $01 ORA Indirect,X
            case 0x11: ORA(indirect_y()); PC += 2; break; // $11 ORA Indirect,Y

            case 0x48: PC += 1; return -1; // TODO $48 PHA

            case 0x08: PC += 1; return -1; // TODO $08 PHP

            case 0x68: PC += 1; return -1; // TODO $69 PLA

            case 0x28: PC += 1; return -1; // TODO $28 PLP

            case 0x2A: ROL(accumulator_ptr()); PC += 1; break; // $2A ROL Accumulator
            case 0x26: ROL(zero_page_ptr()); PC += 2; break; // $26 ROL Zero Page
            case 0x36: ROL(zero_page_x_ptr()); PC += 2; break; // $36 ROL Zero Page,X
            case 0x2E: ROL(absolute_ptr()); PC += 3; break; // $2E ROL Absolute
            case 0x3E: ROL(absolute_x_ptr()); PC += 3; break; // $3E ROL Absolute,X

            case 0x6A: ROR(accumulator_ptr()); PC += 1; break; // $6A ROR Accumulator
            case 0x66: ROR(zero_page_ptr()); PC += 2; break; // $66 ROR Zero Page
            case 0x76: ROR(zero_page_x_ptr()); PC += 2; break; // $76 ROR Zero Page,X
            case 0x6E: ROR(absolute_ptr()); PC += 3; break; // $6E ROR Absolute
            case 0x7E: ROR(absolute_x_ptr()); PC += 3; break; // $7E ROR Absolute,X

            case 0x40: PC += 1; return -1; // TODO $40 RTI Implied

            case 0x60: PC += 1; return -1; // TODO $60 RTS Implied

            case 0xE9: PC += 2; return -1; // TODO $E9 SBC Immediate
            case 0xE5: PC += 2; return -1; // TODO $E5 SBC Zero Page
            case 0xF5: PC += 2; return -1; // TODO $F5 SBC Zero Page,X
            case 0xED: PC += 3; return -1; // TODO $ED SBC Absolute
            case 0xFD: PC += 3; return -1; // TODO $FD SBC Absolute,X
            case 0xF9: PC += 3; return -1; // TODO $F9 SBC Absolute,Y
            case 0xE1: PC += 2; return -1; // TODO $E1 SBC Indirect,X
            case 0xF1: PC += 2; return -1; // TODO $F1 SBC Indirect,Y

            case 0x38: SEC(); PC += 1; break; // $38 SEC

            case 0xF8: SED(); PC += 1; break; // $F8 SED

            case 0x78: SEI(); PC += 1; break; // $78 SEI

            case 0x85: STA(zero_page_ptr()); PC += 2; break; // $85 STA Zero Page
            case 0x95: STA(zero_page_x_ptr()); PC += 2; break; // $95 STA Zero Page,X
            case 0x8D: STA(absolute_ptr()); PC += 3; break; // $8D STA Absolute
            case 0x9D: STA(absolute_x_ptr()); PC += 3; break; // $9D STA Absolute,X
            case 0x99: STA(absolute_y_ptr()); PC += 3; break; // $99 STA Absolute,Y
            case 0x81: STA(indirect_x_ptr()); PC += 2; break; // $81 STA Indirect,X
            case 0x91: STA(indirect_y_ptr()); PC += 2; break; // $91 STA Indirect,Y

            case 0x86: STX(zero_page_ptr()); PC += 2; break; // $86 STX Zero Page
            case 0x96: STX(zero_page_y_ptr()); PC += 2; break; // $96 STX Zero Page,Y
            case 0x8E: STX(absolute_ptr()); PC += 3; break; // $8E STX Absolute

            case 0x84: STY(zero_page_ptr()); PC += 2; break; // $84 STY Zero Page
            case 0x94: STY(zero_page_x_ptr()); PC += 2; break; // $94 STY Zero Page,X
            case 0x8C: STY(absolute_ptr()); PC += 3; break; // $8C STY Absolute

            case 0xAA: TAX(); PC += 1; break; // $AA TAX

            case 0xA8: TAY(); PC += 1; break; // $A8 TAY

            case 0xBA: TSX(); PC += 1; break; // $BA TSX

            case 0x8A: TXA(); PC += 1; break; // $8A TXA

            case 0x9A: TXS(); PC += 1; break; // $9A TXS

            case 0x98: TYA(); PC += 1; break; // $98 TYA

            default: return -1; //unimplemented
        }
    }

    return 0;
}

char getVal(char c){
    if (c >= '0' && c <= '9') {
       return c - '0';
   }
   return c - 'A' + 10;
}

unsigned short getShort() {
    return (MEM[PC + 2] << 8) + MEM[PC + 1];
}

unsigned char* accumulator_ptr() {
    return &A;
}

unsigned char immediate() {
    return MEM[PC + 1];
}

unsigned char zero_page() {
    return *zero_page_ptr();
}

unsigned char* zero_page_ptr() {
    char addr = MEM[PC + 1];
    return &MEM[addr];
}

unsigned char zero_page_x() {
    return *zero_page_x_ptr();
}

unsigned char* zero_page_x_ptr() {
    char addr = MEM[PC + 1];
    return &MEM[(addr + X) & 0xFF];
}

unsigned char zero_page_y() {
    return *zero_page_y_ptr();
}

unsigned char* zero_page_y_ptr() {
    char addr = MEM[PC + 1];
    return &MEM[(addr + Y) & 0xFF];
}

unsigned short absolute() {
    return getShort();
}

unsigned char* absolute_ptr() {
    return &MEM[getShort()];
}

unsigned char absolute_x() {
    return *absolute_x_ptr();
}

unsigned char* absolute_x_ptr() {
    return &MEM[getShort() + X];
}

unsigned char absolute_y() {
    return *absolute_y_ptr();
}

unsigned char* absolute_y_ptr() {
    return &MEM[getShort() + Y];
}

unsigned char indirect() {
    return PC + getShort();
}

unsigned char indirect_x() {
    return *indirect_x_ptr();
}

unsigned char* indirect_x_ptr() {
    return &MEM[zero_page_x()];
}

unsigned char indirect_y() {
    return *indirect_y_ptr();
}

unsigned char* indirect_y_ptr() {
    return &MEM[zero_page_y()];
}

void AND(unsigned char r) {
    printf("AND $%02X\n", r);
    A = A & r;
    Z = A == 0;
    N = A & 0x80;
}

void ASL(unsigned char *r) {
    printf("ASL $%02X\n", *r);
    C = *r & 0x80;
    *r = *r << 1;
    Z = A == 0;
}

void BCC(char delta) {
    printf("BCC $%02X\n", delta);
    if (!C) {
        PC += delta;
    }
}

void BCS(char delta) {
    printf("BCS $%02X\n", delta);
    if (C) {
        PC += delta;
    }
}

void BEQ(char delta) {
    printf("BEQ $%02X\n", delta);
    if (Z) {
        PC += delta;
    }
}

void BIT(unsigned char r) {
    printf("BIT $%02X\n", r);
    unsigned short result = A & r;
    Z = result == 0;
    V = result & 0x40;
    N = result & 0x80;
}

void BPL(char delta) {
    printf("BPL $%02X\n", delta);
    if (!N) {
        PC += delta;
    }
}

void BMI(char delta) {
    printf("BMI $%02X\n", delta);
    if (N) {
        PC += delta;
    }
}

void BNE(char delta) {
    printf("BNE $%02X\n", delta);
    if (!Z) {
        PC += delta;
    }
}

void BVC(char delta) {
    printf("BVC $%02X\n", delta);
    if (!V) {
        PC += delta;
    }
}

void BVS(char delta) {
    printf("BVS $%02X\n", delta);
    if (V) {
        PC += delta;
    }
}

void CLC() {
    printf("CLC\n");
    C = false;
}

void CLD() {
    printf("CLD\n");
    D = false;
}

void CLI() {
    printf("CLI\n");
    I = false;
}

void CLV() {
    printf("CLV\n");
    V = false;
}

void CMP(unsigned char r) {
    printf("CMP $%02X\n", r);
    if (A >= r) {
        C = true;
    }
    Z = A == r;
    N = (A - r) & 0x80;
}

void CPX(unsigned char r) {
    printf("CPX $%02X\n", r);
    if (X >= r) {
        C = true;
    }
    Z = X == r;
    N = (X - r) & 0x80;
}

void CPY(unsigned char r) {
    printf("CPY $%02X\n", r);
    if (Y >= r) {
        C = true;
    }
    Z = Y == r;
    N = (Y - r) & 0x80;
}

void DEC(unsigned char* r) {
    printf("DEC $%02X\n", *r);
    *r -= 1;
    Z = *r == 0;
    N = *r & 0x80;
}

void DEX() {
    printf("DEX\n");
    X -= 1;
    Z = X == 0;
    N = X & 0x80;
}

void DEY() {
    printf("DEY\n");
    Y -= 1;
    Z = Y == 0;
    N = Y & 0x80;
}

void EOR(unsigned char r) {
    printf("EOR $%02X\n", r);
    A = A ^ r;
    Z = A == 0;
    N = A & 0x80;
}

void INC(unsigned char* r) {
    printf("INC $%02X\n", *r);
    *r += 1;
    Z = *r == 0;
    N = *r & 0x80;
}

void INX() {
    printf("INX\n");
    X += 1;
    Z = X == 0;
    N = X & 0x80;
}

void INY() {
    printf("INY\n");
    Y += 1;
    Z = Y == 0;
    N = Y & 0x80;
}

void JMP(unsigned short r) {
    printf("JMP $%02X\n", r);
    PC = r;
}

void LDA(unsigned char r) {
    printf("LDA $%02X\n", r);
    A = r;
    Z = A == 0;
    N = A & 0x80;
}

void LDX(unsigned char r) {
    printf("LDX $%02X\n", r);
    X = r;
    Z = X == 0;
    N = X & 0x80;
}

void LDY(unsigned char r) {
    printf("LDY $%02X\n", r);
    Y = r;
    Z = Y == 0;
    N = Y & 0x80;
}

void LSR(unsigned char* r) {
    printf("LSR $%02X\n", *r);
    C = *r & 0x01;
    *r = *r >> 1;
    Z = *r == 0;
    N = *r & 0x80;
}

void ORA(unsigned char r) {
    printf("ORA $%02X\n", r);
    A = A | r;
    Z = A == 0;
    N = A & 0x80;
}

void ROL(unsigned char* r) {
    printf("ROL $%02X\n", *r);
    unsigned char old_carry = C;
    C = *r & 0x80;
    *r = *r << 1;
    *r = *r | old_carry;
    N = A & 0x80;
    Z = A == 0;
}

void ROR(unsigned char* r) {
    printf("ROR $%02X\n", *r);
    unsigned char old_carry = C;
    C = *r & 0x01;
    *r = *r >> 1;
    *r = *r | (old_carry << 7);
    N = A & 0x80;
    Z = A == 0;
}

void SEC() {
    printf("SEC\n");
    C = true;
}

void SED() {
    printf("SED\n");
    D = true;
}

void SEI() {
    printf("SEI\n");
    I = true;
}

void STA(unsigned char* r) {
    printf("STA $%02X\n", *r);
    *r = A;
}

void STX(unsigned char* r) {
    printf("STX $%02X\n", *r);
    *r = X;
}

void STY(unsigned char* r) {
    printf("STY $%02X\n", *r);
    *r = Y;
}

void TAX() {
    printf("TAX\n");
    X = A;
    N = X & 0x80;
    Z = X == 0;
}

void TAY() {
    printf("TAY\n");
    Y = A;
    N = Y & 0x80;
    Z = Y == 0;
}

void TSX() {
    printf("TSX\n");
    X = S;
    N = X & 0x80;
    Z = X == 0;
}

void TXA() {
    printf("TXA\n");
    A = X;
    N = A & 0x80;
    Z = A == 0;
}

void TXS() {
    printf("TXS\n");
    S = X;
}

void TYA() {
    printf("TYA\n");
    A = Y;
    N = A & 0x80;
    Z = A == 0;
}
