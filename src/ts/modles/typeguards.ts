/****************************************************************************************
 * Copyright (c) 2021. HuiiBuh                                                          *
 * This file (typeguards.ts) is part of InstagramDownloader which is released under     *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/
import { AlertMessage, DownloadProgress } from './extension';

// tslint:disable-next-line:no-any
export const isDownloadProgress = (message: DownloadProgress |  AlertMessage): message is DownloadProgress => (message as any).percent !== undefined;
