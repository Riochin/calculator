class Calculator {
    static readNumber(line, index) {
        let number = 0;
        while (index < line.length && /^\d$/.test(line[index])) {
            number = number * 10 + parseInt(line[index]);
            index++;
        }
        if (index < line.length && line[index] === '.') {
            index++;
            let decimal = 0.1;
            while (index < line.length && /^\d$/.test(line[index])) {
                number += parseInt(line[index]) * decimal;
                decimal /= 10;
                index++;
            }
        }
        return { token: { type: 'NUMBER', number: number }, index: index };
    }

    static readPlus(line, index) {
        return { token: { type: 'PLUS' }, index: index + 1 };
    }

    static readMinus(line, index) {
        return { token: { type: 'MINUS' }, index: index + 1 };
    }

    static readTimes(line, index) {
        return { token: { type: 'TIMES' }, index: index + 1 };
    }

    static readDivides(line, index) {
        return { token: { type: 'DIVIDES' }, index: index + 1 };
    }

    static readParaOpen(line, index) {
        return { token: { type: 'PARA_OPEN' }, index: index + 1 };
    }

    static readParaClose(line, index) {
        return { token: { type: 'PARA_CLOSE' }, index: index + 1 };
    }

    static tokenize(line) {
        const tokens = [];
        let index = 0;
        while (index < line.length) {
            if (/^\d$/.test(line[index])) {
                const result = this.readNumber(line, index);
                tokens.push(result.token);
                index = result.index;
            } else if (line[index] === '+') {
                const result = this.readPlus(line, index);
                tokens.push(result.token);
                index = result.index;
            } else if (line[index] === '-') {
                const result = this.readMinus(line, index);
                tokens.push(result.token);
                index = result.index;
            } else if (line[index] === '*') {
                const result = this.readTimes(line, index);
                tokens.push(result.token);
                index = result.index;
            } else if (line[index] === '/') {
                const result = this.readDivides(line, index);
                tokens.push(result.token);
                index = result.index;
            } else if (line[index] === '(') {
                const result = this.readParaOpen(line, index);
                tokens.push(result.token);
                index = result.index;
            } else if (line[index] === ')') {
                const result = this.readParaClose(line, index);
                tokens.push(result.token);
                index = result.index;
            } else if (line[index] === ' ') {
                index++;
                continue;
            } else {
                throw new Error('Invalid character found: ' + line[index]);
            }
        }
        return tokens;
    }

    static removeParentheses(tokens) {
        const tokensProcessedParentheses = [];
        let i = 0;
        while (i < tokens.length) {
            if (tokens[i].type === 'PARA_OPEN') {
                let openCount = 1;
                let j = i + 1;
                const subExpressionTokens = [];

                while (j < tokens.length && openCount > 0) {
                    if (tokens[j].type === 'PARA_OPEN') {
                        openCount++;
                    } else if (tokens[j].type === 'PARA_CLOSE') {
                        openCount--;
                    }

                    if (openCount > 0) {
                        subExpressionTokens.push(tokens[j]);
                    }
                    j++;
                }
                if (openCount !== 0) {
                    throw new Error("Error: Mismatched parentheses!");
                }

                const subAnswer = this.evaluate(subExpressionTokens);
                tokensProcessedParentheses.push({ type: 'NUMBER', number: subAnswer });
                i = j;
            } else {
                tokensProcessedParentheses.push(tokens[i]);
                i++;
            }
        }
        return tokensProcessedParentheses;
    }

    static processKakeWariZan(tokens) {
        let i = 0;
        const processedTokens = [];
        while (i < tokens.length) {
            if (tokens[i].type === 'TIMES') {
                const lastNumberToken = processedTokens.pop();
                const result = lastNumberToken.number * tokens[i + 1].number;
                processedTokens.push({ type: 'NUMBER', number: result });
                i += 2;
            } else if (tokens[i].type === 'DIVIDES') {
                const lastNumberToken = processedTokens.pop();
                if (tokens[i + 1].number === 0) {
                    throw new Error("Error: Division by zero!!");
                }
                const result = lastNumberToken.number / tokens[i + 1].number;
                processedTokens.push({ type: 'NUMBER', number: result });
                i += 2;
            } else {
                processedTokens.push(tokens[i]);
                i++;
            }
        }
        return processedTokens;
    }

    static processTasuhikuTokens(tokens) {
        tokens.unshift({ type: 'PLUS' });
        let answer = 0;
        let index = 1;

        while (index < tokens.length) {
            if (tokens[index].type === 'NUMBER') {
                if (tokens[index - 1].type === 'PLUS') {
                    answer += tokens[index].number;
                } else if (tokens[index - 1].type === 'MINUS') {
                    answer -= tokens[index].number;
                } else {
                    throw new Error('Invalid syntax');
                }
            }
            index++;
        }
        return answer;
    }

    static evaluate(tokens) {
        tokens = this.removeParentheses(tokens);
        const processedTokens = this.processKakeWariZan(tokens);
        return this.processTasuhikuTokens(processedTokens);
    }

    static calculate(expression) {
        try {
            const tokens = this.tokenize(expression);
            return this.evaluate(tokens);
        } catch (error) {
            throw error;
        }
    }
} 
