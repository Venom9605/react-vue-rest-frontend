import type { IArtist } from "@/domain/IArtist";
import { BaseService } from "./BaseService";
import type { IResultObject } from "@/types/IResultObject";
import type { ArtistEditDto } from "@/types/ArtistEditDto";

export class ArtistUploadService extends BaseService {
  static async uploadProfilePicture(file: File): Promise<IResultObject<{ path: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await this.axios.post<{ path: string }>(
        'Artist/UploadProfilePicture',
        formData
      );

      if (response.status <= 300) {
        return { data: response.data };
      }

      return {
        errors: [(response.status.toString() + ' ' + response.statusText).trim()],
      };
    } catch (err) {
      return {
        errors: [JSON.stringify(err)],
      };
    }
  }
}

export class ArtistService extends BaseService {
  static async getUserInfo(jwt: string): Promise<IResultObject<IArtist>> {
    try {
      const response = await this.axios.get<IArtist>(
        'Artist/GetUserInfo',
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          }
        }
      );

      if (response.status <= 300) return { data: response.data };

      return {
        errors: [(response.status.toString() + ' ' + response.statusText).trim()],
      };
    } catch (err) {
      return {
        errors: [JSON.stringify(err)],
      };
    }
  }

  static async getUserInfoById(userId: string, jwt: string): Promise<IResultObject<IArtist>> {
  try {
    const response = await this.axios.get<IArtist>(
      `Artist/GetUserInfoById/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (response.status <= 300) {
      return { data: response.data };
    }

    return {
      errors: [(response.status.toString() + " " + response.statusText).trim()],
    };
  } catch (err) {
    return {
      errors: [JSON.stringify(err)],
    };
  }
}

static async getMostPopular(jwt: string): Promise<IResultObject<IArtist>> {
  try {
    const response = await this.axios.get<IArtist>(
      'Artist/GetMostPopular',
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (response.status <= 300) {
      return { data: response.data };
    }

    return {
      errors: [(response.status.toString() + ' ' + response.statusText).trim()],
    };
  } catch (err) {
    return {
      errors: [JSON.stringify(err)],
    };
  }
}

  static async editProfile(dto: ArtistEditDto, jwt: string): Promise<IResultObject<void>> {
    try {
      const response = await this.axios.put<void>(
        "Artist/Edit",
        dto,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (response.status <= 300) {
        return { data: undefined };
      }

      return {
        errors: [(response.status.toString() + " " + response.statusText).trim()],
      };
    } catch (err) {
      return {
        errors: [JSON.stringify(err)],
      };
    }
  }
}