#include <stdio.h>
#include "stdbool.h"

unsigned short getShort(FILE* fp);

//implicit
unsigned char* accumulator_ptr();
unsigned char immediate(unsigned char r);
unsigned char zero_page(unsigned char r);
unsigned char* zero_page_ptr(unsigned char r);
unsigned char zero_page_x(unsigned char r);
unsigned char* zero_page_x_ptr(unsigned char r);
unsigned char zero_page_y(unsigned char r);
unsigned char* zero_page_y_ptr(unsigned char r);
//relative
unsigned char absolute(unsigned short r);
unsigned char* absolute_ptr(unsigned short r);
unsigned char absolute_x(unsigned short r);
unsigned char* absolute_x_ptr(unsigned short r);
unsigned char absolute_y(unsigned short r);
unsigned char* absolute_y_ptr(unsigned short r);
unsigned char indirect(unsigned short r);
unsigned char indirect_x(unsigned char r);
unsigned char* indirect_x_ptr(unsigned char r);
unsigned char indirect_y(unsigned char r);
unsigned char* indirect_y_ptr(unsigned char r);

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
void JMP(unsigned char r);
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


int main() {
    printf("Hello, World!\n");

    FILE *fp;
    fp = fopen("tugasz.ksa", "rb");

    while (true) {
        switch(getc(fp)) {
            case 0x69: return -1; // TODO $69 ADC Immediate
            case 0x65: return -1; // TODO $65 ADC Zero Page
            case 0x75: return -1; // TODO $75 ADC Zero Page,X
            case 0x6D: return -1; // TODO $6D ADC Absolute
            case 0x7D: return -1; // TODO $7D ADC Absolute,X
            case 0x79: return -1; // TODO $79 ADC Absolute,Y
            case 0x61: return -1; // TODO $61 ADC Indirect,X
            case 0x71: return -1; // TODO $71 ADC Indirect,Y

            case 0x29: AND(immediate(getc(fp))); break; // $29 AND Immediate
            case 0x25: AND(zero_page(getc(fp))); break; // $25 AND Zero Page
            case 0x35: AND(zero_page_x(getc(fp))); break; // $35 AND Zero Page,X
            case 0x2D: AND(absolute(getShort(fp))); break; // $2D AND Absolute
            case 0x3D: AND(absolute_x(getShort(fp))); break; // $3D AND Absolute,X
            case 0x39: AND(absolute_y(getShort(fp))); break; // $39 AND Absolute,Y
            case 0x21: AND(indirect_x(getc(fp))); break; // $21 AND Indirect,X
            case 0x31: AND(indirect_y(getc(fp))); break; // $31 AND Indirect,Y

            case 0x0A: ASL(accumulator_ptr()); break; // $0A ASL Accumulator
            case 0x06: ASL(zero_page_ptr(getc(fp))); break; // $06 ASL Zero Page
            case 0x16: ASL(zero_page_x_ptr(getc(fp))); break; // $16 ASL Zero Page,X
            case 0x0E: ASL(absolute_ptr(getShort(fp))); break; // $0E ASL Absolute
            case 0x1E: ASL(absolute_x_ptr(getShort(fp))); break; // $1E ASL Absolute,X

            case 0x90: BCC(getc(fp)); break; // $90 BCC

            case 0xB0: BCS(getc(fp)); break; // $B0 BCS

            case 0xF0: BEQ(getc(fp)); break; // $F0 BEQ

            case 0x24: BIT(zero_page(getc(fp))); break; // $24 BIT Zero Page
            case 0x2C: BIT(absolute(getShort(fp))); break; // $2C BIT Absolute

            case 0x30: BMI(getc(fp)); break; // $30 BMI

            case 0xD0: BNE(getc(fp)); break; // $D0 BNE

            case 0x10: BPL(getc(fp)); break; // $10 BPL Relative

            case 0x00: return -1; // TODO $00 BRK Implied

            case 0x50: BVC(getc(fp)); break; // $50 BVC

            case 0x70: BVS(getc(fp)); break; // $70 BVS

            case 0x18: CLC(); break; // $18 CLC

            case 0xD8: CLD(); break; // $D8 CLD

            case 0x58: CLI(); break; // $58 CLI

            case 0xB8: CLV(); break; // $B8 CLV

            case 0xC9: CMP(immediate(getc(fp))); break; // $C9 CMP Immediate
            case 0xC5: CMP(zero_page(getc(fp))); break; // $C5 CMP Zero Page
            case 0xD5: CMP(zero_page_x(getc(fp))); break; // $D5 CMP Zero Page,X
            case 0xCD: CMP(absolute(getShort(fp))); break; // $CD CMP Absolute
            case 0xDD: CMP(absolute_x(getShort(fp))); break; // $DD CMP Absolute,X
            case 0xD9: CMP(absolute_y(getShort(fp))); break; // $D9 CMP Absolute,Y
            case 0xC1: CMP(indirect_x(getc(fp))); break; // $C1 CMP Indirect,X
            case 0xD1: CMP(indirect_y(getc(fp))); break; // $D1 CMP Indirect,Y

            case 0xE0: CPX(immediate(getc(fp))); break; // $E0 CPX Immediate
            case 0xE4: CPX(zero_page(getc(fp))); break; // $E4 CPX Zero Page
            case 0xEC: CPX(absolute(getShort(fp))); break; // $EC CPX Absolute

            case 0xC0: CPY(immediate(getc(fp))); break; // $C0 CPY Immediate
            case 0xC4: CPY(zero_page(getc(fp))); break; // $C4 CPY Zero Page
            case 0xCC: CPY(absolute(getShort(fp))); break; // $CC CPY Absolute

            case 0xC6: DEC(zero_page_ptr(getc(fp))); break; // $C6 DEC Zero Page
            case 0xD6: DEC(zero_page_x_ptr(getc(fp))); break; // $D6 DEC Zero Page,X
            case 0xCE: DEC(absolute_ptr(getShort(fp))); break; // $CE DEC Absolute
            case 0xDE: DEC(absolute_x_ptr(getShort(fp))); break; // $DE DEC Absolute,X

            case 0xCA: DEX(); break; // $CA DEX

            case 0x88: DEY(); break; // $88 DEY

            case 0x49: EOR(immediate(getc(fp))); break; // $49 EOR Immediate
            case 0x45: EOR(zero_page(getc(fp))); break; // $45 EOR Zero Page
            case 0x55: EOR(zero_page_x(getc(fp))); break; // $55 EOR Zero Page,X
            case 0x4D: EOR(absolute(getShort(fp))); break; // $4D EOR Absolute
            case 0x5D: EOR(absolute_x(getShort(fp))); break; // $5D EOR Absolute,X
            case 0x59: EOR(absolute_y(getShort(fp))); break; // $59 EOR Absolute,Y
            case 0x41: EOR(indirect_x(getc(fp))); break; // $41 EOR Indirect,X
            case 0x51: EOR(indirect_y(getc(fp))); break; // $51 EOR Indirect,Y

            case 0xE6: INC(zero_page_ptr(getc(fp))); break; // $E6 INC Zero Page
            case 0xF6: INC(zero_page_x_ptr(getc(fp))); break; // $F6 INC Zero Page,X
            case 0xEE: INC(absolute_ptr(getShort(fp))); break; // $EE INC Absolute
            case 0xFE: INC(absolute_x_ptr(getShort(fp))); break; // $FE INC Absolute,X

            case 0xE8: INX(); break; // $E8 INX

            case 0xC8: INY(); break; // $C8 INY

            case 0x4C: JMP(absolute(getShort(fp))); break; // $4C JMP Absolute
            case 0x6C: JMP(indirect(getShort(fp))); break; // $6C JMP Indirect

            case 0x20: return -1; // TODO $20 JSR Absolute

            case 0xA9: LDA(immediate(getc(fp))); break; // $A9 LDA Immediate
            case 0xA5: LDA(zero_page(getc(fp))); break; // $A5 LDA Zero Page
            case 0xB5: LDA(zero_page_x(getc(fp))); break; // $B5 LDA Zero Page,X
            case 0xAD: LDA(absolute(getShort(fp))); break; // $AD LDA Absolute
            case 0xBD: LDA(absolute_x(getShort(fp))); break; // $BD LDA Absolute,X
            case 0xB9: LDA(absolute_y(getShort(fp))); break; // $B9 LDA Absolute,Y
            case 0xA1: LDA(indirect_x(getc(fp))); break; // $A1 LDA Indirect,X
            case 0xB1: LDA(indirect_y(getc(fp))); break; // $B1 LDA Indirect,Y

            case 0xA2: LDX(immediate(getc(fp))); break; // $A2 LDX Immediate
            case 0xA6: LDX(zero_page(getc(fp))); break; // $A6 LDX Zero Page
            case 0xB6: LDX(zero_page_y(getc(fp))); break; // $B6 LDX Zero Page,Y
            case 0xAE: LDX(absolute(getShort(fp))); break; // $AE LDX Absolute
            case 0xBE: LDX(absolute_y(getShort(fp))); break; // $BE LDX Absolute,Y

            case 0xA0: LDY(immediate(getc(fp))); break; // $A0 LDY Immediate
            case 0xA4: LDY(zero_page(getc(fp))); break; // $A4 LDY Zero Page
            case 0xB4: LDY(zero_page_x(getc(fp))); break; // $B4 LDY Zero Page,X
            case 0xAC: LDY(absolute(getShort(fp))); break; // $AC LDY Absolute
            case 0xBC: LDY(absolute_x(getShort(fp))); break; // $BC LDY Absolute,X

            case 0x4A: LSR(accumulator_ptr()); break; // $4A LSR Accumulator
            case 0x46: LSR(zero_page_ptr(getc(fp))); break; // $46 LSR Zero Page
            case 0x56: LSR(zero_page_x_ptr(getc(fp))); break; // $56 LSR Zero Page,X
            case 0x4E: LSR(absolute_ptr(getShort(fp))); break; // $4E LSR Absolute
            case 0x5E: LSR(absolute_x_ptr(getShort(fp))); break; // $5E LSR Absolute,X

            case 0xEA: break; // $EA NOP Implied

            case 0x09: ORA(immediate(getc(fp))); break; // $09 ORA Immediate
            case 0x04: ORA(zero_page(getc(fp))); break; // $05 ORA Zero Page
            case 0x15: ORA(zero_page_x(getc(fp))); break; // $15 ORA Zero Page,X
            case 0x0D: ORA(absolute(getShort(fp))); break; // $0D ORA Absolute
            case 0x1D: ORA(absolute_x(getShort(fp))); break; // $1D ORA Absolute,X
            case 0x19: ORA(absolute_y(getShort(fp))); break; // $19 ORA Absolute,Y
            case 0x01: ORA(indirect_x(getc(fp))); break; // $01 ORA Indirect,X
            case 0x11: ORA(indirect_y(getc(fp))); break; // $11 ORA Indirect,Y

            case 0x48: return -1; // TODO $48 PHA

            case 0x08: return -1; // TODO $08 PHP

            case 0x68: return -1; // TODO $69 PLA

            case 0x28: return -1; // TODO $28 PLP

            case 0x2A: ROL(accumulator_ptr()); break; // $2A ROL Accumulator
            case 0x26: ROL(zero_page_ptr(getc(fp))); break; // $26 ROL Zero Page
            case 0x36: ROL(zero_page_x_ptr(getc(fp))); break; // $36 ROL Zero Page,X
            case 0x2E: ROL(absolute_ptr(getShort(fp))); break; // $2E ROL Absolute
            case 0x3E: ROL(absolute_x_ptr(getShort(fp))); break; // $3E ROL Absolute,X

            case 0x6A: ROR(accumulator_ptr()); break; // $6A ROR Accumulator
            case 0x66: ROR(zero_page_ptr(getc(fp))); break; // $66 ROR Zero Page
            case 0x76: ROR(zero_page_x_ptr(getc(fp))); break; // $76 ROR Zero Page,X
            case 0x6E: ROR(absolute_ptr(getShort(fp))); break; // $6E ROR Absolute
            case 0x7E: ROR(absolute_x_ptr(getShort(fp))); break; // $7E ROR Absolute,X

            case 0x40: return -1; // TODO $40 RTI Implied

            case 0x60: return -1; // TODO $60 RTS Implied

            case 0xE9: return -1; // TODO $E9 SBC Immediate
            case 0xE5: return -1; // TODO $E5 SBC Zero Page
            case 0xF5: return -1; // TODO $F5 SBC Zero Page,X
            case 0xED: return -1; // TODO $ED SBC Absolute
            case 0xFD: return -1; // TODO $FD SBC Absolute,X
            case 0xF9: return -1; // TODO $F9 SBC Absolute,Y
            case 0xE1: return -1; // TODO $E1 SBC Indirect,X
            case 0xF1: return -1; // TODO $F1 SBC Indirect,Y

            case 0x38: SEC(); break; // $38 SEC

            case 0xF8: SED(); break; // $F8 SED

            case 0x78: SEI(); break; // $78 SEI

            case 0x85: STA(zero_page_ptr(getc(fp))); break; // $85 STA Zero Page
            case 0x95: STA(zero_page_x_ptr(getc(fp))); break; // $95 STA Zero Page,X
            case 0x8D: STA(absolute_ptr(getShort(fp))); break; // $8D STA Absolute
            case 0x9D: STA(absolute_x_ptr(getShort(fp))); break; // $9D STA Absolute,X
            case 0x99: STA(absolute_y_ptr(getShort(fp))); break; // $99 STA Absolute,Y
            case 0x81: STA(indirect_x_ptr(getc(fp))); break; // $81 STA Indirect,X
            case 0x91: STA(indirect_y_ptr(getc(fp))); break; // $91 STA Indirect,Y

            case 0x86: STX(zero_page_ptr(getc(fp))); break; // $86 STX Zero Page
            case 0x96: STX(zero_page_y_ptr(getc(fp))); break; // $96 STX Zero Page,Y
            case 0x8E: STX(absolute_ptr(getShort(fp))); break; // $8E STX Absolute

            case 0x84: STY(zero_page_ptr(getc(fp))); break; // $84 STY Zero Page
            case 0x94: STY(zero_page_x_ptr(getc(fp))); break; // $94 STY Zero Page,X
            case 0x8C: STY(absolute_ptr(getShort(fp))); break; // $8C STY Absolute

            case 0xAA: TAX(); break; // $AA TAX

            case 0xA8: TAY(); break; // $A8 TAY

            case 0xBA: TSX(); break; // $BA TSX

            case 0x8A: TXA(); break; // $8A TXA

            case 0x9A: TXS(); break; // $9A TXS

            case 0x98: TYA(); break; // $98 TYA
        }
    }

    return 0;
}

unsigned short getShort(FILE* fp) {
    return (getc(fp) << 2) + getc(fp);
}

unsigned char* accumulator_ptr() {
    return &A;
}

unsigned char immediate(unsigned char r) {
    return r;
}

unsigned char* zero_page_x_ptr(unsigned char r) {
    return zero_page_ptr((r + X) & 0xFF);
}

unsigned char* zero_page_y_ptr(unsigned char r) {
    return zero_page_ptr((r + Y) & 0xFF);
}

unsigned char* zero_page_ptr(unsigned char r) {
    return &MEM[r];
}

unsigned char zero_page_x(unsigned char r) {
    return *zero_page_x_ptr(r);
}

unsigned char zero_page_y(unsigned char r) {
    return *zero_page_y_ptr(r);
}

unsigned char zero_page(unsigned char r) {
    return *zero_page_ptr(r);
}

unsigned char indirect_x(unsigned char r) {
    return *indirect_x_ptr(r);
}

unsigned char indirect_y(unsigned char r) {
    return *indirect_y_ptr(r);
}

unsigned char* indirect_x_ptr(unsigned char r) {
    return &MEM[zero_page((r + X) & 0xFF)];
}

unsigned char* indirect_y_ptr(unsigned char r) {
    return &MEM[zero_page((r + Y) & 0xFF)];
}

unsigned char* absolute_ptr(unsigned short r) {
    return &MEM[r];
}

unsigned char* absolute_y_ptr(unsigned short r) {
    return absolute_ptr(r + Y);
}

unsigned char* absolute_x_ptr(unsigned short r) {
    return absolute_ptr(r + X);
}

unsigned char absolute(unsigned short r) {
    return *absolute_ptr(r);
}

unsigned char absolute_y(unsigned short r) {
    return absolute(r + Y);
}

unsigned char absolute_x(unsigned short r) {
    return absolute(r + X);
}

unsigned char indirect(unsigned short r) {
    return PC + r;
}

void AND(unsigned char r) {
    A = A & r;
    if (A == 0) {
        Z = true;
    }
    if (A & 0x80) {
        N = true;
    }
}

void ASL(unsigned char *r) {
    C = *r & 0x80;
    *r = *r << 1;
    if (A == 0) {
        Z = true;
    }
}

void BCC(char delta) {
    if (!C) {
        PC += delta;
    }
}

void BCS(char delta) {
    if (C) {
        PC += delta;
    }
}

void BEQ(char delta) {
    if (Z) {
        PC += delta;
    }
}

void BIT(unsigned char r) {
    unsigned short result = A & r;
    if (result == 0) {
        Z = true;
    }
    V = result & 0x40;
    N = result & 0x80;
}

void BPL(char delta) {
    if (!N) {
        PC += delta;
    }
}

void BMI(char delta) {
    if (N) {
        PC += delta;
    }
}

void BNE(char delta) {
    if (!Z) {
        PC += delta;
    }
}

void BVC(char delta) {
    if (!V) {
        PC += delta;
    }
}

void BVS(char delta) {
    if (V) {
        PC += delta;
    }
}

void CLC() {
    C = false;
}

void CLD() {
    D = false;
}

void CLI() {
    I = false;
}

void CLV() {
    V = false;
}

void CMP(unsigned char r) {
    if (A >= r) {
        C = true;
    }
    if (A == r) {
        Z = true;
    }
    if ((A - r) & 0x80) {
        N = true;
    }
}

void CPX(unsigned char r) {
    if (X >= r) {
        C = true;
    }
    if (X == r) {
        Z = true;
    }
    if ((X - r) & 0x80) {
        N = true;
    }
}

void CPY(unsigned char r) {
    if (Y >= r) {
        C = true;
    }
    if (Y == r) {
        Z = true;
    }
    if ((Y - r) & 0x80) {
        N = true;
    }
}

void DEC(unsigned char* r) {
    *r -= 1;
    if (*r == 0) {
        Z = true;
    }
    if (*r & 0x80) {
        N = true;
    }
}

void DEX() {
    X -= 1;
    if (X == 0) {
        Z = true;
    }
    if (X & 0x80) {
        N = true;
    }
}

void DEY() {
    Y -= 1;
    if (Y == 0) {
        Z = true;
    }
    if (Y & 0x80) {
        N = true;
    }
}

void EOR(unsigned char r) {
    A = A ^ r;
    if (A == 0) {
        Z = true;
    }
    if (A & 0x80) {
        N = true;
    }
}

void INC(unsigned char* r) {
    *r += 1;
    if (*r == 0) {
        Z = true;
    }
    if (*r & 0x80) {
        N = true;
    }
}

void INX() {
    X += 1;
    if (X == 0) {
        Z = true;
    }
    if (X & 0x80) {
        N = true;
    }
}

void INY() {
    Y += 1;
    if (Y == 0) {
        Z = true;
    }
    if (Y & 0x80) {
        N = true;
    }
}

void JMP(unsigned char r) {
    PC = r;
}

void LDA(unsigned char r) {
    A = r;
    if (A == 0) {
        Z = true;
    }
    if (A & 0x80) {
        N = true;
    }
}

void LDX(unsigned char r) {
    X = r;
    if (X == 0) {
        Z = true;
    }
    if (X & 0x80) {
        N = true;
    }
}

void LDY(unsigned char r) {
    Y = r;
    if (Y == 0) {
        Z = true;
    }
    if (Y & 0x80) {
        N = true;
    }
}

void LSR(unsigned char* r) {
    C = *r & 0x01;
    *r = *r >> 1;
    if (*r == 0) {
        Z = true;
    }
    if (*r & 0x80) {
        N = true;
    }
}

void ORA(unsigned char r) {
    A = A | r;
    if (A == 0) {
        Z = true;
    }
    if (A & 0x80) {
        N = true;
    }
}

void ROL(unsigned char* r) {
    unsigned char old_carry = C;
    C = *r & 0x80;
    *r = *r << 1;
    *r = *r | old_carry;
    if (A & 0x80) {
        N = true;
    }
    if (A == 0) {
        Z = true;
    }
}

void ROR(unsigned char* r) {
    unsigned char old_carry = C;
    C = *r & 0x01;
    *r = *r >> 1;
    *r = *r | (old_carry << 7);
    if (A & 0x80) {
        N = true;
    }
    if (A == 0) {
        Z = true;
    }
}

void SEC() {
    C = true;
}

void SED() {
    D = true;
}

void SEI() {
    I = true;
}

void STA(unsigned char* r) {
    *r = A;
}

void STX(unsigned char* r) {
    *r = X;
}

void STY(unsigned char* r) {
    *r = Y;
}

void TAX() {
    X = A;
    if (X & 0x80) {
        N = true;
    }
    if (X == 0) {
        Z = true;
    }
}

void TAY() {
    Y = A;
    if (Y & 0x80) {
        N = true;
    }
    if (Y == 0) {
        Z = true;
    }
}

void TSX() {
    X = S;
    if (X & 0x80) {
        N = true;
    }
    if (X == 0) {
        Z = true;
    }
}

void TXA() {
    A = X;
    if (A & 0x80) {
        N = true;
    }
    if (A == 0) {
        Z = true;
    }
}

void TXS() {
    S = X;
}

void TYA() {
    A = Y;
    if (A & 0x80) {
        N = true;
    }
    if (A == 0) {
        Z = true;
    }
}
