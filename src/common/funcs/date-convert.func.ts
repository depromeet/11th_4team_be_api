import { InternalServerErrorException } from '@nestjs/common';

declare global {
  interface Date {
    yyyymmdd(): string;
    hhmmss(): string;
  }
}

Date.prototype.yyyymmdd = function (delimeter = '') {
  const mm = this.getUTCMonth() + 1;
  const dd = this.getUTCDate();

  return [
    this.getUTCFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd,
  ].join(delimeter);
};

Date.prototype.hhmmss = function (delimeter = '') {
  const hh = this.getUTCHours();
  const mm = this.getUTCMinutes();
  const ss = this.getUTCSeconds();

  return [
    (hh > 9 ? '' : '0') + hh,
    (mm > 9 ? '' : '0') + mm,
    (ss > 9 ? '' : '0') + ss,
  ].join(delimeter);
};

function getDatetimeFormatString(date: Date): string {
  if (!date) {
    throw new InternalServerErrorException('date is undefined or null');
  }
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

function getDateFormatString(date: Date): string {
  if (!date) {
    throw new InternalServerErrorException('date is undefined or null');
  }
  return date.toISOString().replace('T', ' ').substring(0, 10);
}

function getCurDate(): Date {
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 9);
  return currentDate;
}

function getCurNumericDateTime(): string {
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 9);
  return `${currentDate.yyyymmdd()}${currentDate.hhmmss()}`;
}

function getCurDatetimeFormatString(): string {
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 9);
  return currentDate.toISOString().replace('T', ' ').substring(0, 19);
}

export {
  getDatetimeFormatString,
  getDateFormatString,
  getCurDate,
  getCurNumericDateTime,
  getCurDatetimeFormatString,
};
